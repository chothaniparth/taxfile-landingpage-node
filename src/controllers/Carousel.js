import { dbConection } from "../config/db.js";

// Create Update Carousel
export const createCarousel = async (req, res) => {
  const { UkeyId, Title = '', Name = '', IsDoc = false, IsActive = true, OrderId = 1, UserName = '', flag = 'A' } = req.body;
  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || 'Not Found';

    let query = ""

    if (flag === 'U') {
      query += `
        DELETE FROM carouselmast WHERE UkeyId = :UkeyId;
      `
    }

    query += `
      INSERT INTO carouselmast (UkeyId, Title, Name, IsDoc, IsActive, OrderId, IpAddress, EntryDate, UserName, flag)
      VALUES (:UkeyId, :Title, :Name, :IsDoc, :IsActive, :OrderId, :IpAddress, GETDATE(), :UserName, :flag);
    `;

    await sequelize.query(query, {
      replacements: { UkeyId, Title, Name, IsDoc, IsActive, OrderId, IpAddress, UserName, flag },
    });

    res.status(200).json({
      message: flag === "A" ? "Carousel created successfully" : "Carousel updated successfully", Success : true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success : false });
  } finally {
    await sequelize.close();
  }
};

// Get AdminLogin (with optional filters)
export const getCarousel = async (req, res) => {
  const { UkeyId, Title, Name, IsDoc, IsActive, OrderId, UserName, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = "SELECT cm.*, dm.FileName, dm.DocUkeyId FROM carouselmast cm left join DocMast dm on cm.UkeyId = dm.MasterUkeyId";
    let countQuery = "SELECT COUNT(*) as totalCount FROM carouselmast cm WHERE 1=1";
    const replacements = {};

    if (UkeyId) {
      query += " AND cm.UkeyId = :UkeyId";
      countQuery += " AND cm.UkeyId = :UkeyId";
      replacements.UkeyId = UkeyId;
    }
    if (Title) {
      query += " AND cm.Title = :Title";
      countQuery += " AND cm.Title = :Title";
      replacements.Title = Title;
    }
    if (Name) {
      query += " AND cm.Name LIKE :Name";
      countQuery += " AND cm.Name LIKE :Name";
      replacements.Name = `%${Name}%`;
    }
    if (IsDoc !== undefined) {
      query += " AND cm.IsDoc = :IsDoc";
      countQuery += " AND cm.IsDoc = :IsDoc";
      replacements.IsDoc = IsDoc;
    }
    if (IsActive !== undefined) {
      query += " AND cm.IsActive = :IsActive";
      countQuery += " AND cm.IsActive = :IsActive";
      replacements.IsActive = IsActive;
    }
    if (OrderId) {
      query += " AND cm.OrderId = :OrderId";
      countQuery += " AND cm.OrderId = :OrderId";
      replacements.OrderId = OrderId;
    }
    if (UserName) {
      query += " AND cm.UserName = :UserName";
      countQuery += " AND cm.UserName = :UserName";
      replacements.UserName = UserName;
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
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};

// Delete Carousel
export const deleteCarousel = async (req, res) => {
  const { UkeyId } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM carouselmast WHERE UkeyId = :UkeyId";
    await sequelize.query(query, { replacements: { UkeyId } });

    res.status(200).json({ message: "User deleted successfully", Success : true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success : false });
  } finally {
    await sequelize.close();
  }
};