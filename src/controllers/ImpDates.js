import { dbConection } from "../config/db.js";

// Create / Update ImpDates
export const createImpDate = async (req, res) => {
  const {
    UkeyId = "", Name = "", ImpDate = null, Description = "", IsActive = true, UserName = req.user?.UserName || "System",
    flag = "A",
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";

    let query = "";

    // For update, delete existing record with the same Name and ImpDate (or you can use UkeyId if available)
    if (flag === "U") {
      query += `
        DELETE FROM ImpDates WHERE Name = :Name AND UkeyId = :UkeyId;
      `;
    }

    query += `
      INSERT INTO ImpDates
      (UkeyId, Name, ImpDate, Description, IsActive, IpAddress, EntryDate, UserName, flag)
      VALUES
      (:UkeyId, :Name, :ImpDate, :Description, :IsActive, :IpAddress, GETDATE(), :UserName, :flag);
    `;

    await sequelize.query(query, {
      replacements: { UkeyId, Name, ImpDate, Description, IsActive, IpAddress, UserName, flag },
    });

    res.status(200).json({
      message: flag === "A" ? "Important Date created successfully" : "Important Date updated successfully",
      Success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

// Get ImpDates (with optional filters)
export const getImpDates = async (req, res) => {
  const { Name, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `SELECT * FROM ImpDates WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM ImpDates WHERE 1=1`;
    const replacements = {};

    if (Name) {
      query += " AND Name LIKE :Name";
      countQuery += " AND Name LIKE :Name";
      replacements.Name = `%${Name}%`;
    }

    query += " ORDER BY EntryDate DESC";

    // Total count
    const [countResult] = await sequelize.query(countQuery, { replacements });
    const totalCount = countResult[0]?.totalCount || 0;

    // Pagination
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

// Delete ImpDates
export const deleteImpDate = async (req, res) => {
  const { UkeyId } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM ImpDates WHERE UkeyId = :UkeyId";
    const result = await sequelize.query(query, { replacements: { UkeyId } });

    if (result[1] === 0) {
      return res.status(404).json({ error: "Important Date not found", Success: false });
    }

    res.status(200).json({ message: "Important Date deleted successfully", Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};
