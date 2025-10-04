import { dbConection } from "../config/db.js";

// Create/Update FAQ
export const createFAQ = async (req, res) => {
  const { 
    FaqUkeyId = "", Ques = "", Ans = "", IsActive = true, UserName = req.user.UserName, flag = "A" 
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";

    let query = "";

    if (flag === "U") {
      query += `
        DELETE FROM FAQmast WHERE FaqUkeyId = :FaqUkeyId;
      `;
    }

    query += `
      INSERT INTO FAQmast (FaqUkeyId, Ques, Ans, IsActive, IpAddress, EntryDate, UserName, flag)
      VALUES (:FaqUkeyId, :Ques, :Ans, :IsActive, :IpAddress, GETDATE(), :UserName, :flag);
    `;

    await sequelize.query(query, {
      replacements: { FaqUkeyId, Ques, Ans, IsActive, IpAddress, UserName, flag },
    });

    res.status(200).json({
      message: flag === "A" ? "FAQ created successfully" : "FAQ updated successfully", Success : true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success : false });
  } finally {
    await sequelize.close();
  }
};

// Get FAQ (with optional filters)
export const getFAQ = async (req, res) => {
  const { FaqUkeyId, Ques, Ans, IsActive, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = "SELECT * FROM FAQmast WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as totalCount FROM FAQmast WHERE 1=1";
    const replacements = {};

    if (FaqUkeyId) {
      query += " AND FaqUkeyId = :FaqUkeyId";
      countQuery += " AND FaqUkeyId = :FaqUkeyId";
      replacements.FaqUkeyId = FaqUkeyId;
    }
    if (Ques) {
      query += " AND Ques LIKE :Ques";
      countQuery += " AND Ques LIKE :Ques";
      replacements.Ques = `%${Ques}%`;
    }
    if (Ans) {
      query += " AND Ans LIKE :Ans";
      countQuery += " AND Ans LIKE :Ans";
      replacements.Ans = `%${Ans}%`;
    }
    if (IsActive !== undefined) {
      query += " AND IsActive = :IsActive";
      countQuery += " AND IsActive = :IsActive";
      replacements.IsActive = IsActive;
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
    res.json({ data: results, totalCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};

// Delete FAQ
export const deleteFAQ = async (req, res) => {
  const { FaqUkeyId } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM FAQmast WHERE FaqUkeyId = :FaqUkeyId";
    await sequelize.query(query, { replacements: { FaqUkeyId } });

    res.status(200).json({ message: "FAQ deleted successfully", Success : true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success : false });
  } finally {
    await sequelize.close();
  }
};