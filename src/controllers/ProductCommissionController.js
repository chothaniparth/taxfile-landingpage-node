import { dbConection } from "../config/db.js";

// Create / Update ProductCommission
export const createProductCommission = async (req, res) => {
  const {
    ProductCommissionID, ProductCguid, DealerLevelCguid, NewSaleCommission = null, RenewalCommission = null, IsActive = null, UserName = req.user?.UserName || "System", flag = "A"
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";
    let query = "";

    if (flag === "U") {
      query += `
        update ProductCommission set
        ProductCguid = :ProductCguid,
        DealerLevelCguid = :DealerLevelCguid,
        NewSaleCommission = :NewSaleCommission,
        RenewalCommission = :RenewalCommission,
        IsActive = :IsActive,
        IpAddress = :IpAddress,
        EntryDate = GETDATE(),
        UserName = :UserName,
        flag = :flag
        WHERE ProductCommissionID = :ProductCommissionID;
      `;
    } else {
      query += `
        INSERT INTO ProductCommission
        (ProductCguid, DealerLevelCguid, NewSaleCommission, RenewalCommission, IsActive, IpAddress, EntryDate, UserName, flag)
        VALUES
        (:ProductCguid, :DealerLevelCguid, :NewSaleCommission, :RenewalCommission, :IsActive, :IpAddress, GETDATE(), :UserName, :flag);
      `;
    }

    await sequelize.query(query, {
      replacements: {
        ProductCommissionID, ProductCguid, DealerLevelCguid, NewSaleCommission, RenewalCommission, IsActive, IpAddress, UserName, flag
      },
    });

    res.status(200).json({
      message:
        flag === "A" ? "Product Commission record created successfully" : "Product Commission record updated successfully", Success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

// Get ProductCommission (with optional filters)
export const getProductCommission = async (req, res) => {
  const { ProductCommissionID, ProductCguid, DealerLevelCguid, IsActive, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `SELECT pc.*, pm.ProductName FROM ProductCommission pc left join ProductMast pm on pc.ProductCguid = pm.ProductUkeyId WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM ProductCommission pc WHERE 1=1`;
    const replacements = {};

    if (ProductCommissionID) {
      query += " AND pc.ProductCommissionID = :ProductCommissionID";
      countQuery += " AND pc.ProductCommissionID = :ProductCommissionID";
      replacements.ProductCommissionID = ProductCommissionID;
    }
    if (IsActive) {
      query += " AND pc.IsActive = :IsActive";
      countQuery += " AND pc.IsActive = :IsActive";
      replacements.IsActive = IsActive;
    }
    if (ProductCguid) {
      query += " AND pc.ProductCguid = :ProductCguid";
      countQuery += " AND pc.ProductCguid = :ProductCguid";
      replacements.ProductCguid = ProductCguid;
    }
    if (DealerLevelCguid) {
      query += " AND pc.DealerLevelCguid = :DealerLevelCguid";
      countQuery += " AND pc.DealerLevelCguid = :DealerLevelCguid";
      replacements.DealerLevelCguid = DealerLevelCguid;
    }

    // Order by ProductCommissionID DESC
    query += " ORDER BY pc.EntryDate DESC";

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

// Delete ProductCommission
export const deleteProductCommission = async (req, res) => {
  const { ProductCommissionID } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM ProductCommission WHERE ProductCommissionID = :ProductCommissionID";
    const result = await sequelize.query(query, { replacements: { ProductCommissionID } });

    if (result[1] === 0) {
      return res.status(404).json({ error: "Product Commission record not found" });
    }

    res.status(200).json({ message: "Product Commission record deleted successfully", Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};