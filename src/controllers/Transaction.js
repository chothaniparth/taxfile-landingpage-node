import { dbConection } from "../config/db.js";

export const addUpdateTransaction = async (req, res) => {
    const { flag, Master, TransactionProduct = [] } = req.body;
    const sequelize = await dbConection();
    const UserName = req.user?.UserName || "System";
    const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";

    const transaction = await sequelize.transaction();

    try {
        if (flag === "U") {
            // Delete existing product data
            await sequelize.query(
                "DELETE FROM TransactionMast WHERE TransactionUkeyId = :TransactionUkeyId",
                { replacements: { TransactionUkeyId: Master.TransactionUkeyId }, transaction }
            );
            await sequelize.query(
                "DELETE FROM TransactionProduct WHERE TransactionUkeyId = :TransactionUkeyId",
                { replacements: { TransactionUkeyId: Master.TransactionUkeyId }, transaction }
            );
            await sequelize.query(
                "DELETE FROM Commission WHERE TransactionUkeyId = :TransactionUkeyId and status = 'Pending'",
                { replacements: { TransactionUkeyId: Master.TransactionUkeyId }, transaction }
            );
        }

        // Insert into ProductMast
        await sequelize.query(
            `
            INSERT INTO TransactionMast
                (TransactionUkeyId, InvoiceNo, InvoiceDate, PartyID, DealerCguid, TxnType, AmountExGST, GSTAmount, GrossAmount, IpAddress, EntryDate, UserName, flag)
            VALUES
                (:TransactionUkeyId, :InvoiceNo, :InvoiceDate, :PartyID, :DealerCguid, :TxnType, :AmountExGST, :GSTAmount, :GrossAmount, :IpAddress, GETDATE(), :UserName, :flag)
        `,
            {
                replacements: {
                    TransactionUkeyId: Master.TransactionUkeyId, InvoiceNo: Master.InvoiceNo, InvoiceDate: Master.InvoiceDate, PartyID: Master.PartyID, DealerCguid: Master.DealerCguid, TxnType: Master.TxnType, AmountExGST: Master.AmountExGST, GSTAmount: Master.GSTAmount, GrossAmount: Master.GrossAmount, IpAddress, UserName, flag,
                },
                transaction
            }
        );

        // Insert ProductPricing
        for (const tp of TransactionProduct) {
            await sequelize.query(
                `
            INSERT INTO TransactionProduct
                (TransactionUkeyId, ProductCguid, CategoryID, Quantity, Rate, AmountExGST, GSTAmount, GrossAmount, Remarks, EntryDate, IpAddress, UserName, flag)
            VALUES
                (:TransactionUkeyId, :ProductCguid, :CategoryID, :Quantity, :Rate, :AmountExGST, :GSTAmount, :GrossAmount, :Remarks, GETDATE(), :IpAddress, :UserName, :flag)
            `,
                {
                    replacements: {
                        TransactionUkeyId: tp.TransactionUkeyId, ProductCguid: tp.ProductCguid, CategoryID: tp.CategoryID, Quantity: tp.Quantity, Rate: tp.Rate, AmountExGST: tp.AmountExGST, GSTAmount: tp.GSTAmount, GrossAmount: tp.GrossAmount, Remarks: tp.Remarks, IpAddress, UserName, flag
                    },
                    transaction
                }
            );
        }

        await sequelize.query(
            `EXEC CalculateCommissionForTransaction @TransactionUkeyId = :TransactionUkeyId`,
            {
                replacements: {
                    TransactionUkeyId: Master.TransactionUkeyId
                },
                transaction   // 👈 IMPORTANT
            }
        );

        await transaction.commit();

        res.status(200).json({
            message: flag === "A" ? "Transaction added successfully" : "Transaction updated successfully",
            Success: true
        });
    } catch (err) {
        await transaction.rollback();
        console.error(err);
        res.status(500).json({ error: err.message, Success: false });
    } finally {
        await sequelize.close();
    }
}

export const managePayout = async (req, res) => {
    const { Mode, PeriodStart, PeriodEnd, PayoutCguid, PaymentReferencePrefix } = req.body;
    const sequelize = await dbConection();
    try {
        let result = []
        switch (Mode) {
            case "GeneratePayoutRun":
                [result] = await sequelize.query(`EXEC GeneratePayoutRun  @PeriodStart = :PeriodStart,@PeriodEnd   = :PeriodEnd`, { replacements: { PeriodStart, PeriodEnd } })
                break
            case "MarkPayoutAsPaid":
                [result] = await sequelize.query(`EXEC MarkPayoutAsPaid  @PayoutCguid = :PayoutCguid, @PaymentReferencePrefix = :PaymentReferencePrefix `, { replacements: { PayoutCguid, PaymentReferencePrefix } })
                break
        }

        return res.status(200).json({ data: result, Success: true, ...req.body })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message, Success: false });
    } finally {
        await sequelize.close();
    }
}

export const transactionList = async (req, res) => {
    const { SubUkeyId, SubCateName, CategoryId, IsActive, Page, PageSize } = req.query;
    const sequelize = await dbConection();

    try {
        let query = `select tm.*, p.PartyName, d.DealerName from TransactionMast tm left join Party p on tm.PartyID = p.ParentID left join Dealer d on tm.DealerCguid = d.DealerCguid WHERE 1=1`;
        let countQuery = `SELECT COUNT(*) as totalCount FROM TransactionMast WHERE 1=1`;
        const replacements = {};

        if (SubUkeyId) {
            query += " AND SubUkeyId = :SubUkeyId";
            countQuery += " AND SubUkeyId = :SubUkeyId";
            replacements.SubUkeyId = SubUkeyId;
        }
        if (SubCateName) {
            query += " AND SubCateName = :SubCateName";
            countQuery += " AND SubCateName = :SubCateName";
            replacements.SubCateName = SubCateName;
        }
        if (CategoryId) {
            query += " AND CategoryId LIKE :CategoryId";
            countQuery += " AND CategoryId LIKE :CategoryId";
            replacements.CategoryId = `%${CategoryId}%`;
        }
        if (IsActive) {
            query += " AND IsActive = :IsActive";
            countQuery += " AND IsActive = :IsActive";
            replacements.IsActive = IsActive;
        }

        // Always order by EntryDate DESC
        query += " ORDER BY EntryDate DESC";

        // Get total count first
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

        res.status(200).json({
            data: results,
            totalCount,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    } finally {
        await sequelize.close();
    }
}

export const transactionListById = async (req, res) => {
    const { TransactionUkeyId } = req.params;

    if (!TransactionUkeyId) {
        return res.status(400).json({ error: "TransactionUkeyId is required" });
    }

    const sequelize = await dbConection();

    try {

        const [transactiontResult] = await sequelize.query(
            "select * from TransactionMast where TransactionUkeyId = :TransactionUkeyId",
            { replacements: { TransactionUkeyId } }
        );

        if (!transactiontResult || transactiontResult.length === 0) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        const transaction = transactiontResult[0];

        const [transactionproductResult] = await sequelize.query(
            "SELECT * FROM TransactionProduct WHERE TransactionUkeyId = :TransactionUkeyId ORDER BY EntryDate ASC",
            { replacements: { TransactionUkeyId } }
        );

        // const [commissionResult] = await sequelize.query(
        //   "SELECT * FROM Commission WHERE TransactionUkeyId = :TransactionUkeyId ORDER BY EntryDate ASC",
        //   { replacements: { TransactionUkeyId } }
        // );

        res.status(200).json({
            Master: transaction,
            TransactionProduct: transactionproductResult,
            Success: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message, Success: false });
    } finally {
        await sequelize.close();
    }
};

export const commissionList = async (req, res) => {
    const { CommissionUkeyId, TransactionUkeyId, ProductCguid, DealerCguid, Status, Page, PageSize } = req.query;
    const sequelize = await dbConection();

    try {
        let query = `select c.*, tm.InvoiceNo, pm.ProductName, d.DealerName, dl.LevelName from Commission c
                     left join TransactionMast tm
                     on c.TransactionUkeyId = tm.TransactionUkeyId
                     left join ProductMast pm
                     on c.ProductCguid = pm.ProductUkeyId
                     left join Dealer d
                     on c.DealerCguid = d.DealerCguid
                     left join DealerLevel dl
                     on c.DealerLevelCguid = dl.Cguid WHERE 1=1`;
        let countQuery = `SELECT COUNT(*) as totalCount FROM Commission WHERE 1=1`;
        const replacements = {};

        if (CommissionUkeyId) {
            query += " AND CommissionUkeyId = :CommissionUkeyId";
            countQuery += " AND CommissionUkeyId = :CommissionUkeyId";
            replacements.CommissionUkeyId = CommissionUkeyId;
        }
        if (TransactionUkeyId) {
            query += " AND TransactionUkeyId = :TransactionUkeyId";
            countQuery += " AND TransactionUkeyId = :TransactionUkeyId";
            replacements.TransactionUkeyId = TransactionUkeyId;
        }
        if (ProductCguid) {
            query += " AND ProductCguid LIKE :ProductCguid";
            countQuery += " AND ProductCguid LIKE :ProductCguid";
            replacements.ProductCguid = ProductCguid;
        }
        if (DealerCguid) {
            query += " AND DealerCguid = :DealerCguid";
            countQuery += " AND DealerCguid = :DealerCguid";
            replacements.DealerCguid = DealerCguid;
        }
        if (Status) {
            query += " AND Status = :Status";
            countQuery += " AND Status = :Status";
            replacements.Status = Status;
        }

        // Always order by EntryDate DESC
        query += " ORDER BY CommissionID DESC";

        // Get total count first
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

        res.status(200).json({
            data: results,
            totalCount,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    } finally {
        await sequelize.close();
    }
}

export const deleteTransaction = async (req, res) => {
    const { TransactionUkeyId } = req.params;
    const sequelize = await dbConection();
    const transaction = await sequelize.transaction();
    try {
        // delete from child tables first
        await sequelize.query("DELETE FROM TransactionMast WHERE TransactionUkeyId = :TransactionUkeyId", { replacements: { TransactionUkeyId }, transaction });
        await sequelize.query("DELETE FROM TransactionProduct WHERE TransactionUkeyId = :TransactionUkeyId", { replacements: { TransactionUkeyId }, transaction });

        await transaction.commit();
        res.status(200).json({ message: "Transaction deleted successfully", Success: true });
    } catch (err) {
        await transaction.rollback();
        console.error(err);
        res.status(500).json({ error: err.message, Success: false });
    } finally {
        await sequelize.close();
    }
}