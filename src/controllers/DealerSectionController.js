import { dbConection } from "../config/db.js";

// Create / Update DealerSection
export const createDealerSection = async (req, res) => {
  const {
    Cguid = null, Sectiontype = null, Notes = null, IsActive = null, UserName = req.user?.UserName || "System", flag = "A"
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";
    let query = "";

    if (flag === "U") {
      query += `
        DELETE FROM dealersection WHERE Cguid = :Cguid;
      `;
    }

    query += `
      INSERT INTO dealersection
      (Cguid, Sectiontype, Notes, IsActive, IpAddress, EntryDate, UserName, flag)
      VALUES
      (:Cguid, :Sectiontype, :Notes, :IsActive, :IpAddress, GETDATE(), :UserName, :flag);
    `;

    await sequelize.query(query, {
      replacements: {
        Cguid, Sectiontype, Notes, IsActive, IpAddress, UserName, flag
      },
    });

    res.status(200).json({
      message:
        flag === "A" ? "Dealer Section record created successfully" : "Dealer Section record updated successfully", Success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

// Get DealerSection (with optional filters)
export const getDealerSection = async (req, res) => {
  const { Cguid, Sectiontype, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `SELECT * FROM dealersection WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM dealersection WHERE 1=1`;
    const replacements = {};

    if (Cguid) {
      query += " AND Cguid = :Cguid";
      countQuery += " AND Cguid = :Cguid";
      replacements.Cguid = Cguid;
    }
    if (Sectiontype) {
      query += " AND Sectiontype LIKE :Sectiontype";
      countQuery += " AND Sectiontype LIKE :Sectiontype";
      replacements.Sectiontype = Sectiontype;
    }

    // Order by Id DESC
    query += " ORDER BY Id DESC";

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

// Delete DealerSection
export const deleteDealerSection = async (req, res) => {
  const { Cguid } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM dealersection WHERE Cguid = :Cguid";
    const result = await sequelize.query(query, { replacements: { Cguid } });

    if (result[1] === 0) {
      return res.status(404).json({ error: "Dealer Section record not found" });
    }

    res.status(200).json({ message: "Dealer Section record deleted successfully", Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};
