import { dbConection } from "../config/db.js";

// Create / Update YTvideo
export const createYTvideo = async (req, res) => {
  const {
    UkeyId = '',
    ProductUkeyId = '',
    URL = '',
    IsActive = true,
    UserName = req.user.UserName,
    flag = 'A'
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress =
      req?.headers['x-forwarded-for'] ||
      req?.socket?.remoteAddress ||
      'Not Found';

    let query = "";

    if (flag === 'U') {
      query += `
        DELETE FROM YTvideoMast WHERE UkeyId = :UkeyId;
      `;
    }

    query += `
      INSERT INTO YTvideoMast (UkeyId, ProductUkeyId, URL, IsActive, IpAddress, EntryDate, UserName, flag)
      VALUES (:UkeyId, :ProductUkeyId, :URL, :IsActive, :IpAddress, GETDATE(), :UserName, :flag);
    `;

    await sequelize.query(query, {
      replacements: { UkeyId, ProductUkeyId, URL, IsActive, IpAddress, UserName, flag },
    });

    res.status(200).json({
      message: flag === "A" ? "YT video created successfully" : "YT video updated successfully", Success : true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success : false });
  } finally {
    await sequelize.close();
  }
};

// Get YTvideo (with optional filters)
export const getYTvideo = async (req, res) => {
  const { UkeyId, ProductUkeyId, URL, IsActive, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `select ytm.*, pm.ProductUkeyId from YTvideoMast ytm left join ProductMast pm on pm.ProductUkeyId = ytm.UkeyId WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM YTvideoMast ytm left join ProductMast pm on pm.ProductUkeyId = ytm.UkeyId WHERE 1=1`;
    const replacements = {};

    if (UkeyId) {
      query += " AND UkeyId = :UkeyId";
      countQuery += " AND UkeyId = :UkeyId";
      replacements.UkeyId = UkeyId;
    }
    if (ProductUkeyId) {
      query += " AND ProductUkeyId = :ProductUkeyId";
      countQuery += " AND ProductUkeyId = :ProductUkeyId";
      replacements.ProductUkeyId = ProductUkeyId;
    }
    if (URL) {
      query += " AND URL = :URL";
      countQuery += " AND URL = :URL";
      replacements.URL = URL;
    }
    if (IsActive !== undefined) {
      query += " AND IsActive = :IsActive";
      countQuery += " AND IsActive = :IsActive";
      replacements.IsActive = IsActive;
    }

    // Always order by EntryDate DESC
    query += " ORDER BY EntryDate DESC";

    // Get total count
    const [countResult] = await sequelize.query(countQuery, { replacements });
    const totalCount = countResult[0]?.totalCount || 0;

    // Apply pagination if provided
    const pageNum = parseInt(Page, 10);
    const pageSizeNum = parseInt(PageSize, 10);

    if (!isNaN(pageNum) && !isNaN(pageSizeNum) && pageNum > 0 && pageSizeNum > 0) {
      const offset = (pageNum - 1) * pageSizeNum;
      query += " OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY";
      replacements.offset = offset;
      replacements.pageSize = pageSizeNum;
    }

    const [results] = await sequelize.query(query, { replacements });
    res.status(200).json({ data: results, totalCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success : false });
  } finally {
    await sequelize.close();
  }
};

// Delete YTvideo
export const deleteYTvideo = async (req, res) => {
  const { UkeyId } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM YTvideoMast WHERE UkeyId = :UkeyId";
    const result = await sequelize.query(query, { replacements: { UkeyId } });
    
    // if (!result[1].rowCount) {
    //   return res.status(404).json({ error: "YT video not found" });
    // }

    res.status(200).json({ message: "YT video deleted successfully", Success : true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success : false });
  } finally {
    await sequelize.close();
  }
};
