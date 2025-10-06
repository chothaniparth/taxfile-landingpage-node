import { dbConection } from "../config/db.js";

// Create / Update Client
export const createClient = async (req, res) => {
  const {
    ClientUkeyId = "", Companyname = "", Remarks = "", Link = "", IsActive = true, UserName = req.user?.UserName || "System", flag = "A",
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";

    let query = "";

    if (flag === "U") {
      query += `
        DELETE FROM ClientMast WHERE ClientUkeyId = :ClientUkeyId;
      `;
    }

    query += `
      INSERT INTO ClientMast
      (ClientUkeyId, Companyname, Remarks, Link, IsActive, IpAddress, EntryDate, UserName, flag)
      VALUES
      (:ClientUkeyId, :Companyname, :Remarks, :Link, :IsActive, :IpAddress, GETDATE(), :UserName, :flag);
    `;

    await sequelize.query(query, {
      replacements: {
        ClientUkeyId, Companyname, Remarks, Link, IsActive, IpAddress, UserName, flag,
      },
    });

    res.status(200).json({
      message:
        flag === "A" ? "Client record created successfully" : "Client record updated successfully",
      Success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

// Get Clients (with optional filters)
export const getClients = async (req, res) => {
  const { ClientUkeyId, Companyname, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `SELECT * FROM ClientMast WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM ClientMast WHERE 1=1`;
    const replacements = {};

    if (ClientUkeyId) {
      query += " AND ClientUkeyId = :ClientUkeyId";
      countQuery += " AND ClientUkeyId = :ClientUkeyId";
      replacements.ClientUkeyId = ClientUkeyId;
    }
    if (Companyname) {
      query += " AND Companyname LIKE :Companyname";
      countQuery += " AND Companyname LIKE :Companyname";
      replacements.Companyname = `%${Companyname}%`;
    }

    // Always order by EntryDate DESC
    query += " ORDER BY EntryDate DESC";

    // Get total count
    const [countResult] = await sequelize.query(countQuery, { replacements });
    const totalCount = countResult[0]?.totalCount || 0;

    // Apply pagination if provided
    const pageNum = parseInt(Page, 10);
    const pageSizeNum = parseInt(PageSize, 10);

    if (
      !isNaN(pageNum) &&
      !isNaN(pageSizeNum) &&
      pageNum > 0 &&
      pageSizeNum > 0
    ) {
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

// Delete Client
export const deleteClient = async (req, res) => {
  const { ClientUkeyId } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM ClientMast WHERE ClientUkeyId = :ClientUkeyId";
    const result = await sequelize.query(query, {
      replacements: { ClientUkeyId },
    });

    if (result[1] === 0) {
      return res.status(404).json({ error: "Client record not found", Success: false });
    }

    res.status(200).json({ message: "Client record deleted successfully", Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};