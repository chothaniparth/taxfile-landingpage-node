import { dbConection } from "../config/db.js";

export const payoutrunList = async (req, res) => {
    const { Page, PageSize } = req.query;
    const sequelize = await dbConection()

    try {
        let query = `select * from PayoutRun WHERE 1=1`;
        let countQuery = `SELECT COUNT(*) as totalCount FROM PayoutRun WHERE 1=1`;
        const replacements = {};
        
        // Always order by EntryDate DESC
        query += " ORDER BY PayoutRunID asc";

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

export const payoutlineList = async (req, res) => {
    const { Page, PageSize } = req.query;
    const sequelize = await dbConection()
    
    try {
        let query = `select pl.*, dl.DealerName from PayoutLine pl left join Dealer dl on pl.DealerCguid = dl.DealerCguid WHERE 1=1`;
        let countQuery = `SELECT COUNT(*) as totalCount FROM PayoutLine pl WHERE 1=1`;
        const replacements = {};

        // Always order by EntryDate DESC
        query += " ORDER BY pl.PayoutLineID asc";

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