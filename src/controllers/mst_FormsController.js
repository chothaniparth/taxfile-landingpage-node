import { dbConection } from "../config/db.js";

// Get Forms List
export const getForms = async (req, res) => {
  const { Page, PageSize, CategoryID } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `SELECT * FROM mst_Forms WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM mst_Forms WHERE 1=1`;
    const replacements = {};

    if (CategoryID) {
      query += " AND CategoryID = :CategoryID";
      countQuery += " AND CategoryID = :CategoryID";
      replacements.CategoryID = CategoryID;
    }

    // Order by FormsID DESC
    query += " ORDER BY FormsID DESC";

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

    res.status(200).json({ data: results, totalCount, Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};
