import { dbConection } from "../config/db.js";

export const createEmpSetting = async (req, res) => {
  const { CRMEmpIds = [], Mode = "", flag } = req.body;
  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";

    // Start transaction for data consistency
    const transaction = await sequelize.transaction();

    if (flag === "U") {
      await sequelize.query(`DELETE FROM EmpSetting WHERE Mode = :Mode`, {
        replacements: { Mode },
        transaction,
      });
    }

    for (const Id of CRMEmpIds) {
      await sequelize.query(
        `
        INSERT INTO EmpSetting (CRMEmpId, IpAddress, EntryTime, Mode)
        VALUES (:CRMEmpId, :IpAddress, GETDATE(), :Mode);
        `,
        {
          replacements: { CRMEmpId: Id, IpAddress, Mode },
          transaction,
        }
      );
    }

    await transaction.commit();

    res.status(200).json({
      message:
        flag === "A" ? "Client record(s) created successfully" : "CRMEmpIds record(s) updated successfully",
      Success: true,
    });
  } catch (err) {
    console.error(err);
    if (sequelize.transaction) await sequelize.transaction.rollback();
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

// Get Clients (with optional filters)
export const getEmpSetting = async (req, res) => {
  const { Page, PageSize, Mode } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `SELECT * from EmpSetting where 1 = 1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM EmpSetting where 1=1`;
    const replacements = {};

    if(Mode){
        query += " AND Mode = :Mode";
        countQuery += " AND Mode = :Mode";
        replacements.Mode = Mode;
    }

    // Always order by EntryDate DESC
    query += " ORDER BY EntryTime DESC";

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