import { dbConection } from "../config/db.js";

// CREATE / UPDATE Complaint
export const createComplaint = async (req, res) => {
  const {
    ComplaintUkeyId = "", PartyName = "", ComplaintBy = "", ContactNo = "", VisitingHours = "", Query = "", flag = "A", UserName = req.user?.UserName || "System",
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress =
      req?.headers["x-forwarded-for"] ||
      req?.socket?.remoteAddress ||
      "Not Found";

    let query = "";

    // If update, delete old record first
    if (flag === "U") {
      query += `
        DELETE FROM ComplaintMast WHERE ComplaintUkeyId = :ComplaintUkeyId;
      `;
    }

    // Insert record
    query += `
      INSERT INTO ComplaintMast
      (ComplaintUkeyId, PartyName, ComplaintBy, ContactNo, VisitingHours, Query, flag, IpAddress, EntryDate, UserName)
      VALUES
      (:ComplaintUkeyId, :PartyName, :ComplaintBy, :ContactNo, :VisitingHours, :Query, :flag, :IpAddress, GETDATE(), :UserName);
    `;

    await sequelize.query(query, {
      replacements: {
        ComplaintUkeyId, PartyName, ComplaintBy, ContactNo, VisitingHours, Query, flag, IpAddress, UserName,
      },
    });

    res.status(200).json({
      message:
        flag === "A"
          ? "Complaint created successfully"
          : "Complaint updated successfully",
      Success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

// GET Complaint(s) with optional filters + pagination
export const getComplaint = async (req, res) => {
  const {
    ComplaintUkeyId,
    PartyName,
    ComplaintBy,
    Page,
    PageSize,
  } = req.query;

  const sequelize = await dbConection();

  try {
    let query = `SELECT * FROM ComplaintMast WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM ComplaintMast WHERE 1=1`;
    const replacements = {};

    if (ComplaintUkeyId) {
      query += " AND ComplaintUkeyId = :ComplaintUkeyId";
      countQuery += " AND ComplaintUkeyId = :ComplaintUkeyId";
      replacements.ComplaintUkeyId = ComplaintUkeyId;
    }

    if (PartyName) {
      query += " AND PartyName LIKE :PartyName";
      countQuery += " AND PartyName LIKE :PartyName";
      replacements.PartyName = `%${PartyName}%`;
    }

    if (ComplaintBy) {
      query += " AND ComplaintBy LIKE :ComplaintBy";
      countQuery += " AND ComplaintBy LIKE :ComplaintBy";
      replacements.ComplaintBy = `%${ComplaintBy}%`;
    }

    // Always order by EntryDate DESC
    query += " ORDER BY EntryDate DESC";

    // Get total count for pagination
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

    res.status(200).json({
      data: results,
      totalCount,
      Success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error", Success: false });
  } finally {
    await sequelize.close();
  }
};

// DELETE Complaint
export const deleteComplaint = async (req, res) => {
  const { ComplaintUkeyId } = req.params;

  const sequelize = await dbConection();

  try {
    const query = `
      DELETE FROM ComplaintMast WHERE ComplaintUkeyId = :ComplaintUkeyId
    `;

    const result = await sequelize.query(query, {
      replacements: { ComplaintUkeyId },
    });

    if (result[1] === 0) {
      return res
        .status(404)
        .json({ error: "Complaint not found", Success: false });
    }

    res.status(200).json({
      message: "Complaint deleted successfully",
      Success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};
