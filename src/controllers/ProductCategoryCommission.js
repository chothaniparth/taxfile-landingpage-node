import { dbConection } from "../config/db.js";

export const getProductCategoryCommission = async (req, res) => {
  const { ProductCategoryCommissionID, CategoryID, IsActive, Page, PageSize } = req.query
  const sequelize = await dbConection()
  try {
    let query = `SELECT * FROM ProductCategoryCommission WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) AS totalcount FROM ProductCategoryCommission WHERE 1=1`;
    const replacements = {};

    if (ProductCategoryCommissionID) {
      query += `AND ProductCategoryCommissionID = :ProductCategoryCommissionID`;
      countQuery += `AND ProductCategoryCommissionID = :ProductCategoryCommissionID`;
      replacements.ProductCategoryCommissionID = ProductCategoryCommissionID
    }

    if (CategoryID) {
      query += ` AND CategoryID = :CategoryID`;
      countQuery += ` AND CategoryID = :CategoryID`;
      replacements.CategoryID = CategoryID
    }

    if (IsActive !== undefined) {
      query += ` AND IsActive = :IsActive`;
      countQuery += ` AND IsActive = :IsActive`;
      replacements.IsActive = IsActive;
    }

    query += ` ORDER BY EntryDate DESC`;

    const [countResult] = await sequelize.query(countQuery, { replacements });
    const totalCount = countResult[0]?.totalcount || 0;

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

  } catch (error) {
    res.status(500).json({ error: "Database error", Success: false });
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

export const createProductCategoryCommission = async (req, res) => {
    const { ProductCategoryCommissionID = "", CategoryID = "", DealerLevelCguid = "", NewSaleCommission = "", RenewalCommission = "", IsActive = true, UserName = req.user?.UserName || "System", flag = "A" } = req.body
    const sequelize = await dbConection()

    try {

        const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";

        if (flag === "U") {

            if (!ProductCategoryCommissionID) {
                return res.status(400).json({ message: "ID is required for update", Success: false });
            }

            const result = await sequelize.query(`
      UPDATE ProductCategoryCommission set    
      CategoryID = :CategoryID,
      DealerLevelCguid = :DealerLevelCguid,
      NewSaleCommission = :NewSaleCommission,
      RenewalCommission = :RenewalCommission,
      IsActive = :IsActive,
      IpAddress = :IpAddress,
      EntryDate = GETDATE(),
      UserName = :UserName,
      flag = :flag
      where ProductCategoryCommissionID = :ProductCategoryCommissionID`,
                {
                    replacements: {
                        ProductCategoryCommissionID, CategoryID, DealerLevelCguid, NewSaleCommission, RenewalCommission, IsActive, IpAddress, UserName, flag
                    },
                });

            // console.log("result => ", result);

            return res.status(200).json({
                message: "Product Category Commission Record Updated Successfully",
                Success: true
            });
        }

        await sequelize.query(`
      INSERT INTO ProductCategoryCommission
      (CategoryID, DealerLevelCguid, NewSaleCommission, RenewalCommission, IsActive, IpAddress, EntryDate, UserName, flag)
      VALUES
      (:CategoryID, :DealerLevelCguid, :NewSaleCommission, :RenewalCommission, :IsActive, :IpAddress, GETDATE(), :UserName, :flag)`, {
            replacements: {
                CategoryID, DealerLevelCguid, NewSaleCommission, RenewalCommission, IsActive, IpAddress, UserName, flag
            },
        }
        );

        res.status(200).json({
            message: "Product Category Commission Record Created Successfully",
            Success: true
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, Success: false });
    } finally {
        await sequelize.close();
    }
}

export const deleteProductCategoryCommission = async (req, res) => {
  const { ProductCategoryCommissionID } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM ProductCategoryCommission WHERE ProductCategoryCommissionID = :ProductCategoryCommissionID";
    const result = await sequelize.query(query, { replacements: { ProductCategoryCommissionID } });

    if (result[1] === 0) {
      return res.status(404).json({ error: "ProductCategoryCommission record not found" });
    }

    res.status(200).json({ message: "Product Category Commission record deleted successfully", Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
}