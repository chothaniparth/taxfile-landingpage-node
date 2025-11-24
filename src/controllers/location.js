import { dbConection } from "../config/db.js";

export const fetchCity = async (req, res) => {
    const {Page, PageSize} = req.query
    const sequelize = await dbConection();

    try {
        let query = `SELECT * FROM City WHERE 1=1`;
        let countQuery = `SELECT COUNT(*) as totalCount FROM City WHERE 1=1`;
        const replacements = {};

        query += " ORDER BY CityID DESC";

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
    }catch(error){
        res.status(500).json({ error: error.message, Success: false });
    }finally{
        await sequelize.close();
    }
}

export const fetchstate = async (req, res) => {
    const {Page, PageSize} = req.query
    const sequelize = await dbConection();

    try {
        let query = `SELECT * FROM State WHERE 1=1`;
        let countQuery = `SELECT COUNT(*) as totalCount FROM State WHERE 1=1`;
        const replacements = {};

        query += " ORDER BY StateID DESC";

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
    }catch(error){
        res.status(500).json({ error: error.message, Success: false });
    }finally{
        await sequelize.close();
    }
}