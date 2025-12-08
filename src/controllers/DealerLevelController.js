import { dbConection } from "../config/db.js";

// Create / Update DealerLevel
export const createDealerLevel = async (req, res) => {
  const {
    Cguid = null, LevelName, CommissionPercentNew, CommissionPercentRenew, OverridePercent = null, TargetAmount = null, Notes1 = null, Notes2 = null, UserName = req.user?.UserName || "System", flag = "A"
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";
    let query = "";

    if (flag === "U") {
      query += `
        DELETE FROM DealerLevel WHERE Cguid = :Cguid;
      `;
    }

    query += `
      INSERT INTO DealerLevel
      (Cguid, LevelName, CommissionPercentNew, CommissionPercentRenew, OverridePercent, TargetAmount, Notes, flag, IpAddress, EntryDate, UserName, Notes1, Notes2)
      VALUES
      (:Cguid, :LevelName, :CommissionPercentNew, :CommissionPercentRenew, :OverridePercent, :TargetAmount, :Notes, :flag, :IpAddress, GETDATE(), :UserName, :Notes1, :Notes2);
    `;

    await sequelize.query(query, {
      replacements: {
        Cguid, LevelName, CommissionPercentNew, CommissionPercentRenew, OverridePercent, TargetAmount, flag, IpAddress, UserName, Notes1, Notes2
      },
    });

    res.status(200).json({
      message:
        flag === "A" ? "Dealer Level record created successfully" : "Dealer Level record updated successfully", Success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

// Get DealerLevel (with optional filters)
export const getDealerLevel = async (req, res) => {
  const { Cguid, LevelName, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `SELECT * FROM DealerLevel WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM DealerLevel WHERE 1=1`;
    const replacements = {};

    if (Cguid) {
      query += " AND Cguid = :Cguid";
      countQuery += " AND Cguid = :Cguid";
      replacements.Cguid = Cguid;
    }
    if (LevelName) {
      query += " AND LevelName LIKE :LevelName";
      countQuery += " AND LevelName LIKE :LevelName";
      replacements.LevelName = `%${LevelName}%`;
    }

    // Order by DealerLevelId DESC
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

export const getDealerLevelforLP = async (req, res) => {
  const sequelize = await dbConection();

  try {
    const [results] = await sequelize.query(`select * from DealerLevelview`);

    res.status(200).json({ data: results, Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error", Success: false });
  } finally {
    await sequelize.close();
  }
};

// Delete DealerLevel
export const deleteDealerLevel = async (req, res) => {
  const { Cguid } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM DealerLevel WHERE Cguid = :Cguid";
    const result = await sequelize.query(query, { replacements: { Cguid } });

    if (result[1] === 0) {
      return res.status(404).json({ error: "Dealer Level record not found" });
    }

    res.status(200).json({ message: "Dealer Level record deleted successfully", Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};
