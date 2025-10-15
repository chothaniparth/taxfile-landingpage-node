import { dbConection } from "../config/db.js";

// CREATE / UPDATE VacancyApply
export const createVacancyApply = async (req, res) => {
  const {
    UkeyId = "", Name = "", Mobile = "", Email = "", UserName = req.user?.UserName || "System", flag = "A", vacencyMastUkeyId = ''
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";

    let query = "";

    if (flag === "U") {
      query += `
        DELETE FROM VacancyApply WHERE UkeyId = :UkeyId;
      `;
    }

    query += `
      INSERT INTO VacancyApply
      (UkeyId, Name, Mobile, Email, IpAddress, EntryDate, UserName, flag, vacencyMastUkeyId)
      VALUES
      (:UkeyId, :Name, :Mobile, :Email, :IpAddress, GETDATE(), :UserName, :flag, :vacencyMastUkeyId);
    `;

    await sequelize.query(query, {
      replacements: {
        UkeyId, Name, Mobile, Email, IpAddress, UserName, flag, vacencyMastUkeyId
      },
    });

    res.status(200).json({
      message: flag === "A" ? "Vacancy applied successfully" : "Vacancy application updated successfully",
      Success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

// GET VacancyApply (with filters + pagination)
export const getVacancyApply = async (req, res) => {
  const { UkeyId, Name, Email, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `SELECT va.*, dm.FileName FROM VacancyApply va left join DocMast dm on dm.MasterUkeyId = va.UkeyId WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM VacancyApply va WHERE 1=1`;
    const replacements = {};

    if (UkeyId) {
      query += " AND UkeyId = :UkeyId";
      countQuery += " AND UkeyId = :UkeyId";
      replacements.UkeyId = UkeyId;
    }
    if (Name) {
      query += " AND Name LIKE :Name";
      countQuery += " AND Name LIKE :Name";
      replacements.Name = `%${Name}%`;
    }
    if (Email) {
      query += " AND Email LIKE :Email";
      countQuery += " AND Email LIKE :Email";
      replacements.Email = `%${Email}%`;
    }

    // Sort by latest entries first
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
    res.status(200).json({ data: results, totalCount, Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error", Success: false });
  } finally {
    await sequelize.close();
  }
};

// DELETE VacancyApply
export const deleteVacancyApply = async (req, res) => {
  const { UkeyId } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM VacancyApply WHERE UkeyId = :UkeyId";
    const result = await sequelize.query(query, { replacements: { UkeyId } });

    if (result[1] === 0) {
      return res.status(404).json({ error: "Vacancy application not found", Success: false });
    }

    res.status(200).json({ message: "Vacancy application deleted successfully", Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};
