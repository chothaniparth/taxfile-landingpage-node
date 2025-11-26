import { dbConection } from "../config/db.js";
import dotenv from 'dotenv';
dotenv.config();

export const getUpdateHistory = async (req, res) => {
  const {  Page, PageSize } = req.query;
  const sequelize = await dbConection(process.env.ITAX_MASTER_DB_NAME, process.env.ITAX_DB_USER, process.env.ITAX_DB_PASSWORD, process.env.ITAX_DB_SERVER);

  try {
    let query = `select dh.*,p.[partyname],CASE WHEN dh.[IsOver]=1 THEN 'Sucess' ELSE 'Failed' END as Result from
    [Web_DownloadHistory] dh left join [Party] p on
    dh.[PartyId]=p.[PartyId] WHERE 1=1`;

    let countQuery = `SELECT COUNT(*) as totalCount 
    FROM [Web_DownloadHistory] dh 
    LEFT JOIN [Party] p ON dh.[PartyId] = p.[PartyId] WHERE 1=1`;

    const replacements = {};

    // Always order by EntryDate DESC
    query += " ORDER BY StartTime DESC";

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

    res.status(200).json({ data: results, totalCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};
