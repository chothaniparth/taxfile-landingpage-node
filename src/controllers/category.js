import { dbConection } from "../config/db.js";

export const getCategory = async (req, res) => {
  const { CategoryId, CategoryName, IsActive, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `SELECT * FROM CategoryMast WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) AS totalCount FROM CategoryMast WHERE 1=1`;
    const replacements = {};

    // 🔍 Filters
    if (CategoryId) {
      query += " AND CategoryId = :CategoryId";
      countQuery += " AND CategoryId = :CategoryId";
      replacements.CategoryId = CategoryId;
    }

    if (CategoryName) {
      query += " AND CategoryName LIKE :CategoryName";
      countQuery += " AND CategoryName LIKE :CategoryName";
      replacements.CategoryName = `%${CategoryName}%`;
    }

    if (IsActive !== undefined && IsActive !== "") {
      query += " AND IsActive = :IsActive";
      countQuery += " AND IsActive = :IsActive";
      replacements.IsActive = IsActive 
    }

    // 📊 Get total count
    const [countResult] = await sequelize.query(countQuery, { replacements });
    const totalCount = countResult[0]?.totalCount || 0;

    // 📄 Sorting (latest first)
    query += " ORDER BY CategoryId DESC";

    // ⏩ Pagination
    const pageNum = parseInt(Page, 10);
    const pageSizeNum = parseInt(PageSize, 10);
    if (!isNaN(pageNum) && !isNaN(pageSizeNum) && pageNum > 0 && pageSizeNum > 0) {
      const offset = (pageNum - 1) * pageSizeNum;
      query += " OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY";
      replacements.offset = offset;
      replacements.pageSize = pageSizeNum;
    }

    // 📦 Fetch results
    const [results] = await sequelize.query(query, { replacements });

    res.status(200).json({
      data: results,
      totalCount,
      Success: true,
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

export const createOrUpdateCategory = async (req, res) => {
  const { CategoryId, CategoryName, IsActive, flag } = req.body;
  const sequelize = await dbConection();

  try {

    if (flag === "U") {
      await sequelize.query(
        `update CategoryMast set 
        CategoryName = :CategoryName,
        IsActive = :IsActive
        WHERE CategoryId = :CategoryId`,
        { replacements: { CategoryId, CategoryName, IsActive } }
      );
    } else {
      await sequelize.query(
        `INSERT INTO CategoryMast (CategoryName, IsActive)
         VALUES (:CategoryName, :IsActive)`,
        { replacements: { CategoryName, IsActive } }
      );
    }

    res.status(200).json({
      message: flag === "A" ? "Category created successfully" : "Category updated successfully",
      Success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  }finally {
    await sequelize.close();
  }
};

export const deleteCategory = async (req, res) => {
  const { CategoryId } = req.params;
  const sequelize = await dbConection();
  try{
    await sequelize.query(`DELETE FROM CategoryMast WHERE CategoryId = :CategoryId`, {
      replacements: { CategoryId },
    });
    res.status(200).json({
      message: "Category deleted successfully",
      Success: true,
    });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  }finally {
    await sequelize.close();
  }
}