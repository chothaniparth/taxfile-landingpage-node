import { dbConection } from "../config/db.js";

// Create / Update Vacancy
export const createVacancy = async (req, res) => {
  const {
    VacancyUkeyId, Title = "", PostedDate = new Date(), NoofPost = 0, Experience = "", Details = "", IsActive = true, UserName = req.user?.UserName || "System", flag = "A",
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";

    let query = "";

    // If flag is 'U' — delete existing record before inserting updated data
    if (flag === "U") {
      query += `
        DELETE FROM VacancyMast WHERE VacancyUkeyId = :VacancyUkeyId;
      `;
    }

    // Insert (used for both Add / Update)
    query += `
      INSERT INTO VacancyMast
      (VacancyUkeyId, Title, PostedDate, NoofPost, Experience, Details, IsActive, IpAddress, EntryDate, UserName, flag)
      VALUES
      (:VacancyUkeyId, :Title, :PostedDate, :NoofPost, :Experience, :Details, :IsActive, :IpAddress, GETDATE(), :UserName, :flag);
    `;

    await sequelize.query(query, {
      replacements: {
        VacancyUkeyId, Title, PostedDate, NoofPost, Experience, Details, IsActive, IpAddress, UserName, flag,
      },
    });

    res.status(200).json({
      message:
        flag === "A" ? "Vacancy record created successfully" : "Vacancy record updated successfully",
      Success: true,
    });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

// Get Vacancy list with optional filters and pagination
export const getVacancy = async (req, res) => {
  const { Title, Experience, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `SELECT * FROM VacancyMast WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM VacancyMast WHERE 1=1`;
    const replacements = {};

    if (Title) {
      query += " AND Title LIKE :Title";
      countQuery += " AND Title LIKE :Title";
      replacements.Title = `%${Title}%`;
    }
    if (Experience) {
      query += " AND Experience LIKE :Experience";
      countQuery += " AND Experience LIKE :Experience";
      replacements.Experience = `%${Experience}%`;
    }

    query += " ORDER BY EntryDate DESC";

    // Get total count
    const [countResult] = await sequelize.query(countQuery, { replacements });
    const totalCount = countResult[0]?.totalCount || 0;

    // Pagination
    const pageNum = parseInt(Page, 10);
    const pageSizeNum = parseInt(PageSize, 10);
    if (
      !isNaN(pageNum) && !isNaN(pageSizeNum) && pageNum > 0 && pageSizeNum > 0
    ) {
      const offset = (pageNum - 1) * pageSizeNum;
      query += " OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY";
      replacements.offset = offset;
      replacements.pageSize = pageSizeNum;
    }

    const [results] = await sequelize.query(query, { replacements });

    res.status(200).json({ data: results, totalCount });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};

// Delete Vacancy
export const deleteVacancy = async (req, res) => {
  const { VacancyUkeyId } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM VacancyMast WHERE VacancyUkeyId = :VacancyUkeyId";
    const result = await sequelize.query(query, { replacements: { VacancyUkeyId } });

    if (result[1] === 0) {
      return res.status(404).json({ error: "Vacancy record not found", Success: false });
    }

    res.status(200).json({ message: "Vacancy record deleted successfully", Success: true });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};
