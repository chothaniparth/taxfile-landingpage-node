import { dbConection } from "../config/db.js";

// Create / Update DealerCustomCommission
export const createDealerCustomCommission = async (req, res) => {
  const {
    DealerCustomCommissionID, DealerCguid, ProductCguid, NewSaleCommission = null, RenewalCommission = null, IsActive = null, UserName = req.user?.UserName || "System", flag = "A"
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";
    let query = "";

    if (flag === "U") {
      query += `
        update DealerCustomCommission set
        DealerCguid = :DealerCguid,
        ProductCguid = :ProductCguid,
        NewSaleCommission = :NewSaleCommission,
        RenewalCommission = :RenewalCommission,
        IsActive = :IsActive,
        IpAddress = :IpAddress,
        EntryDate = GETDATE(),
        UserName = :UserName,
        flag = :flag
        WHERE DealerCustomCommissionID = :DealerCustomCommissionID;
      `;
    }else{
      query += `
        INSERT INTO DealerCustomCommission
        (DealerCguid, ProductCguid, NewSaleCommission, RenewalCommission, IsActive, IpAddress, EntryDate, UserName, flag)
        VALUES
        (:DealerCguid, :ProductCguid, :NewSaleCommission, :RenewalCommission, :IsActive, :IpAddress, GETDATE(), :UserName, :flag);
      `;
    }


    await sequelize.query(query, {
      replacements: {
        DealerCustomCommissionID, DealerCguid, ProductCguid, NewSaleCommission, RenewalCommission, IsActive, IpAddress, UserName, flag
      },
    });

    res.status(200).json({
      message:
        flag === "A" ? "Dealer Custom Commission record created successfully" : "Dealer Custom Commission record updated successfully", Success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

// Get DealerCustomCommission (with optional filters)
export const getDealerCustomCommission = async (req, res) => {
  const { DealerCustomCommissionID, DealerCguid, ProductCguid, IsActive, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `select dcc.*, dl.DealerName, pm.ProductName, dm.FileName from DealerCustomCommission dcc left join Dealer dl on dcc.DealerCguid = dl.DealerCguid left join ProductMast pm on pm.ProductUkeyId = dcc.ProductCguid left join DocMast dm on dm.MasterUkeyId = dcc.ProductCguid WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM DealerCustomCommission dcc WHERE 1=1`;
    const replacements = {};

    if (DealerCustomCommissionID) {
      query += " AND DealerCustomCommissionID = :DealerCustomCommissionID";
      countQuery += " AND DealerCustomCommissionID = :DealerCustomCommissionID";
      replacements.DealerCustomCommissionID = DealerCustomCommissionID;
    }
    if (IsActive) {
      query += " AND dcc.IsActive = :IsActive";
      countQuery += " AND dcc.IsActive = :IsActive";
      replacements.IsActive = IsActive;
    }
    if (DealerCguid) {
      query += " AND dcc.DealerCguid = :DealerCguid";
      countQuery += " AND dcc.DealerCguid = :DealerCguid";
      replacements.DealerCguid = DealerCguid;
    }
    if (ProductCguid) {
      query += " AND dcc.ProductCguid = :ProductCguid";
      countQuery += " AND dcc.ProductCguid = :ProductCguid";
      replacements.ProductCguid = ProductCguid;
    }

    // Order by DealerCustomCommissionID DESC
    query += " ORDER BY dcc.EntryDate DESC";

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

// Delete DealerCustomCommission
export const deleteDealerCustomCommission = async (req, res) => {
  const { DealerCustomCommissionID } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM DealerCustomCommission WHERE DealerCustomCommissionID = :DealerCustomCommissionID";
    const result = await sequelize.query(query, { replacements: { DealerCustomCommissionID } });

    if (result[1] === 0) {
      return res.status(404).json({ error: "Dealer Custom Commission record not found" });
    }

    res.status(200).json({ message: "Dealer Custom Commission record deleted successfully", Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};