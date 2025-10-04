import { dbConection } from "../config/db.js";

// Create Update Carousel
export const createSubCategory = async (req, res) => {
  const { SubUkeyId = '', SubCateName = '', CategoryId = '', IsActive = true, UserName = req.user.UserName, flag = 'A' } = req.body;
  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || 'Not Found';

    let query = ""

    if (flag === 'U') {
      query += `
        DELETE FROM  SubCateMast WHERE SubUkeyId = :SubUkeyId;
      `
    }

    query += `
      INSERT INTO  SubCateMast (SubUkeyId, SubCateName, CategoryId, IsActive, IpAddress, EntryDate, UserName, flag)
      VALUES (:SubUkeyId, :SubCateName, :CategoryId, :IsActive, :IpAddress, GETDATE(), :UserName, :flag);
    `;

    await sequelize.query(query, {
      replacements: { SubUkeyId, SubCateName, CategoryId, IsActive, IpAddress, UserName, flag },
    });

    res.status(201).json({
      message: flag === "A" ? "Sub Category created successfully" : "Sub Category updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};

// Get AdminLogin (with optional filters)
export const getSubCategory = async (req, res) => {
  const { SubUkeyId, SubCateName, CategoryId, IsActive, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `SELECT scm.*, cm.CategoryName FROM SubCateMast scm
                 LEFT JOIN CategoryMast cm ON cm.CategoryId = scm.CategoryId
                 WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM SubCateMast scm
                      LEFT JOIN CategoryMast cm ON cm.CategoryId = scm.CategoryId
                      WHERE 1=1`;
    const replacements = {};

    if (SubUkeyId) {
      query += " AND scm.SubUkeyId = :SubUkeyId";
      countQuery += " AND scm.SubUkeyId = :SubUkeyId";
      replacements.SubUkeyId = SubUkeyId;
    }
    if (SubCateName) {
      query += " AND scm.SubCateName = :SubCateName";
      countQuery += " AND scm.SubCateName = :SubCateName";
      replacements.SubCateName = SubCateName;
    }
    if (CategoryId) {
      query += " AND scm.CategoryId LIKE :CategoryId";
      countQuery += " AND scm.CategoryId LIKE :CategoryId";
      replacements.CategoryId = `%${CategoryId}%`;
    }
    if (IsActive) {
      query += " AND scm.IsActive = :IsActive";
      countQuery += " AND scm.IsActive = :IsActive";
      replacements.IsActive = IsActive;
    }

    // Always order by EntryDate DESC
    query += " ORDER BY scm.EntryDate DESC";

    // Get total count first
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

    res.json({
      data: results,
      totalCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};

// Delete Carousel
export const deleteSubCategory = async (req, res) => {
  const { SubUkeyId } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM  SubCateMast WHERE SubUkeyId = :SubUkeyId";
    const result = await sequelize.query(query, { replacements: { SubUkeyId } });

    if (result[1] === 0) {
      return res.status(404).json({ error: "Sub category not found" });
    }

    res.json({ message: "Sub category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};