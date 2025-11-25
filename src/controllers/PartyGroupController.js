import { dbConection } from "../config/db.js";

// Create / Update PartyGroup
export const createPartyGroup = async (req, res) => {
  const {
    GroupUkeyId = "", PartyGroupName = "", IsActive = true, UserName = req.user?.UserName || "System", flag = "A"
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";
    let query = "";

    if (flag === "U") {
      query += `
        DELETE FROM PartyGroup WHERE GroupUkeyId = :GroupUkeyId;
      `;
    }

    query += `
      INSERT INTO PartyGroup
      (GroupUkeyId, PartyGroupName, IsActive, IpAddress, EntryDate, UserName, flag)
      VALUES
      (:GroupUkeyId, :PartyGroupName, :IsActive, :IpAddress, GETDATE(), :UserName, :flag);
    `;

    await sequelize.query(query, {
      replacements: {
        GroupUkeyId, PartyGroupName, IsActive, IpAddress, UserName, flag
      },
    });

    res.status(200).json({
      message:
        flag === "A" ? "Party Group record created successfully" : "Party Group record updated successfully", Success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

// Get PartyGroup (with optional filters)
export const getPartyGroup = async (req, res) => {
  const { GroupUkeyId, PartyGroupName, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `SELECT * FROM PartyGroup WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM PartyGroup WHERE 1=1`;
    const replacements = {};

    if (GroupUkeyId) {
      query += " AND GroupUkeyId = :GroupUkeyId";
      countQuery += " AND GroupUkeyId = :GroupUkeyId";
      replacements.GroupUkeyId = GroupUkeyId;
    }
    if (PartyGroupName) {
      query += " AND PartyGroupName LIKE :PartyGroupName";
      countQuery += " AND PartyGroupName LIKE :PartyGroupName";
      replacements.PartyGroupName = `%${PartyGroupName}%`;
    }

    // Order by EntryDate DESC
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

    res.status(200).json({ data: results, totalCount, Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error", Success: false });
  } finally {
    await sequelize.close();
  }
};

// Delete PartyGroup
export const deletePartyGroup = async (req, res) => {
  const { GroupUkeyId } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM PartyGroup WHERE GroupUkeyId = :GroupUkeyId";
    const result = await sequelize.query(query, { replacements: { GroupUkeyId } });

    if (result[1] === 0) {
      return res.status(404).json({ error: "Party Group record not found" });
    }

    res.status(200).json({ message: "Party Group record deleted successfully", Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};
