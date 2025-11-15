import { dbConection } from "../config/db.js";

// Create / Update content
export const createContent = async (req, res) => {
    const {
        ContentUkId = "", ContentTitle = "", ContentDetails = "", IsActive = true, UserName = req.user?.UserName || "System", flag = "A" } = req.body;

    const sequelize = await dbConection();

    try {
        const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";

        let query = "";

        if (flag === "U") {
            query += `
        DELETE FROM ContentMast WHERE ContentUkId = :ContentUkId;
      `;
        }

        query += `
      INSERT INTO ContentMast
      (ContentUkId, ContentTitle, ContentDetails, IsActive, EntryDate, IpAddress, UserName, flag)
      VALUES
      (:ContentUkId, :ContentTitle, :ContentDetails, :IsActive, GETDATE(), :IpAddress, :UserName, :flag);
    `;

        await sequelize.query(query, {
            replacements: {
                ContentUkId, ContentTitle, ContentDetails, IsActive, UserName, IpAddress, flag
            },
        });

        res.status(200).json({
            message:
                flag === "A" ? "Content Us record created successfully" : "Content Us record updated successfully", Success: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message, Success: false });
    } finally {
        await sequelize.close();
    }
};

// Get Content (with optional filters)
export const getContent = async (req, res) => {
    const { ContentUkId, ContentTitle, ContentDetails, Page, PageSize } = req.query;
    const sequelize = await dbConection();

    try {
        let query = `SELECT * FROM ContentMast WHERE 1=1`;
        let countQuery = `SELECT COUNT(*) as totalCount FROM ContentMast WHERE 1=1`;
        const replacements = {};

        if (ContentUkId) {
            query += " AND ContentUkId = :ContentUkId";
            countQuery += " AND ContentUkId = :ContentUkId";
            replacements.ContentUkId = ContentUkId;
        }
        if (ContentTitle) {
            query += " AND ContentTitle LIKE :ContentTitle";
            countQuery += " AND ContentTitle LIKE :ContentTitle";
            replacements.ContentTitle = `%${ContentTitle}%`;
        }
        if (ContentDetails) {
            query += " AND ContentDetails LIKE :ContentDetails";
            countQuery += " AND ContentDetails LIKE :ContentDetails";
            replacements.ContentDetails = `%${ContentDetails}%`;
        }

        // Always order by EntryDate DESC
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

        // const [team] = await sequelize.query(`SELECT tm.*, dm.FileName, dm.DocUkeyId FROM TeamMast tm left join DocMast dm on dm.MasterUkeyId = tm.UkeyId where tm.Type = 'FounderManagement' order by tm.EntryDate DESC`);
        res.status(200).json({ data: results, totalCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    } finally {
        await sequelize.close();
    }
};

// Delete AboutUs
export const deleteContent = async (req, res) => {
    const { ContentUkId } = req.params;
    const sequelize = await dbConection();

    try {
        const query = "DELETE FROM ContentMast WHERE ContentUkId = :ContentUkId";
        const result = await sequelize.query(query, { replacements: { ContentUkId } });

        if (result[1] === 0) {
            return res.status(404).json({ error: "Content Us record not found" });
        }

        res.status(200).json({ message: "Content Us record deleted successfully", Success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message, Success: false });
    } finally {
        await sequelize.close();
    }
};