import { dbConection } from "../config/db.js";

// Create / Update BranchMast
export const createBranchMast = async (req, res) => {
  const {
    BranchUkeyId = "", BranchName = "", City = "", Add1 = "", ContactPerson = "", Email = "", Mode = "", IsActive = true, UserName = req.user?.UserName || "System", flag = "A", Link = "", Mobile = '', Phone = ''
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";

    let query = "";

    if (flag === "U") {
      query += `
        DELETE FROM BranchMast WHERE BranchUkeyId = :BranchUkeyId;
      `;
    }

    query += `
      INSERT INTO BranchMast
      (BranchUkeyId, BranchName, City, Add1, ContactPerson, Email, Mode, IsActive, IpAddress, EntryDate, UserName, flag, Link, Mobile, Phone)
      VALUES
      (:BranchUkeyId, :BranchName, :City, :Add1, :ContactPerson, :Email, :Mode, :IsActive, :IpAddress, GETDATE(), :UserName, :flag, :Link, :Mobile, :Phone);
    `;

    await sequelize.query(query, {
      replacements: {
        BranchUkeyId, BranchName, City, Add1, ContactPerson, Email, Mode, IsActive, IpAddress, UserName, flag, Link, Mobile, Phone
      },
    });

    res.status(200).json({
      message: flag === "A" ? "Branch record created successfully" : "Branch record updated successfully",
      Success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

// Get BranchMast (with optional filters)
export const getBranchMast = async (req, res) => {
  const { BranchUkeyId, BranchName, City, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `SELECT * FROM BranchMast WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM BranchMast WHERE 1=1`;
    const replacements = {};

    if (BranchUkeyId) {
      query += " AND BranchUkeyId = :BranchUkeyId";
      countQuery += " AND BranchUkeyId = :BranchUkeyId";
      replacements.BranchUkeyId = BranchUkeyId;
    }
    if (BranchName) {
      query += " AND BranchName LIKE :BranchName";
      countQuery += " AND BranchName LIKE :BranchName";
      replacements.BranchName = `%${BranchName}%`;
    }
    if (City) {
      query += " AND City LIKE :City";
      countQuery += " AND City LIKE :City";
      replacements.City = City;
    }

    query += " ORDER BY EntryDate DESC";

    // Get total count
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

// Delete BranchMast
export const deleteBranchMast = async (req, res) => {
  const { BranchUkeyId } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM BranchMast WHERE BranchUkeyId = :BranchUkeyId";
    const result = await sequelize.query(query, { replacements: { BranchUkeyId } });

    if (result[1] === 0) {
      return res.status(404).json({ error: "Branch record not found", Success: false });
    }

    res.status(200).json({ message: "Branch record deleted successfully", Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};
