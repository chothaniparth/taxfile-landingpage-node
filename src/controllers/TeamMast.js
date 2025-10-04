import { dbConection } from "../config/db.js";

// Create / Update Team
export const createTeam = async (req, res) => {
  const {
    UkeyId = "", Name = "", Designation = "", Links = "", IsActive = true, UserName = req.user?.UserName || "System", flag = "A",
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";

    let query = "";

    if (flag === "U") {
      query += `
        DELETE FROM TeamMast WHERE UkeyId = :UkeyId;
      `;
    }

    query += `
      INSERT INTO TeamMast
      (UkeyId, Name, Designation, Links, IsActive, IpAddress, EntryDate, UserName, flag)
      VALUES
      (:UkeyId, :Name, :Designation, :Links, :IsActive, :IpAddress, GETDATE(), :UserName, :flag);
    `;

    await sequelize.query(query, {
      replacements: { UkeyId, Name, Designation, Links, IsActive, IpAddress, UserName, flag },
    });

    res.status(200).json({
      message: flag === "A" ? "Team record created successfully" : "Team record updated successfully", Success : true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:  err.message, Success : false });
  } finally {
    await sequelize.close();
  }
};

// Get Team (with optional filters)
export const getTeam = async (req, res) => {
  const { UkeyId, IsActive, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `SELECT * FROM TeamMast WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM TeamMast WHERE 1=1`;
    const replacements = {};

    if (UkeyId) {
      query += " AND UkeyId = :UkeyId";
      countQuery += " AND UkeyId = :UkeyId";
      replacements.UkeyId = UkeyId;
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
    res.status(500).json({ error:  err.message, Success : false });
  } finally {
    await sequelize.close();
  }
};

// Delete Team
export const deleteTeam = async (req, res) => {
  const { UkeyId } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM TeamMast WHERE UkeyId = :UkeyId";
    const result = await sequelize.query(query, { replacements: { UkeyId } });

    if (result[1] === 0) {
      return res.status(404).json({ error: "Team record not found" });
    }

    res.status(200).json({ message: "Team record deleted successfully" , Success : true});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:  err.message, Success : false });
  } finally {
    await sequelize.close();
  }
};