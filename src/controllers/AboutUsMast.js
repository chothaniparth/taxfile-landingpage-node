import { dbConection } from "../config/db.js";

// Create / Update AboutUs
export const createAboutUs = async (req, res) => {
  const {
    AboutUkeyId = "", LongDetails = "", Mission = "", Vision = "", Core1 = "", Counter1 = 0, Counter2 = 0, Counter3 = 0, Counter4 = 0, UserName = req.user?.UserName || "System", flag = "A", Core2, Core3, Core4, FB, Insta, Linkedin, YT, Twitter
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";

    let query = "";

    if (flag === "U") {
      query += `
        DELETE FROM AboutUsMast WHERE AboutUkeyId = :AboutUkeyId;
      `;
    }

    query += `
      INSERT INTO AboutUsMast
      (AboutUkeyId, LongDetails, Mission, Vision, Core1, Counter1, Counter2, Counter3, Counter4, IpAddress, EntryDate, UserName, flag, Core2, Core3, Core4, FB, Insta, Linkedin, YT, Twitter)
      VALUES
      (:AboutUkeyId, :LongDetails, :Mission, :Vision, :Core1, :Counter1, :Counter2, :Counter3, :Counter4, :IpAddress, GETDATE(), :UserName, :flag, :Core2, :Core3, :Core4, :FB, :Insta, :Linkedin, :YT, :Twitter);
    `;

    await sequelize.query(query, {
      replacements: {
        AboutUkeyId, LongDetails, Mission, Vision, Core1, Counter1, Counter2, Counter3, Counter4, IpAddress, UserName, flag, Core2, Core3, Core4, FB, Insta, Linkedin, YT, Twitter
      },
    });

    res.status(200).json({
      message:
        flag === "A" ? "About Us record created successfully" : "About Us record updated successfully", Success : true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success : false });
  } finally {
    await sequelize.close();
  }
};

// Get AboutUs (with optional filters)
export const getAboutUs = async (req, res) => {
  const { AboutUkeyId, Mission, Vision, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `SELECT * FROM AboutUsMast WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM AboutUsMast WHERE 1=1`;
    const replacements = {};

    if (AboutUkeyId) {
      query += " AND AboutUkeyId = :AboutUkeyId";
      countQuery += " AND AboutUkeyId = :AboutUkeyId";
      replacements.AboutUkeyId = AboutUkeyId;
    }
    if (Mission) {
      query += " AND Mission LIKE :Mission";
      countQuery += " AND Mission LIKE :Mission";
      replacements.Mission = `%${Mission}%`;
    }
    if (Vision) {
      query += " AND Vision LIKE :Vision";
      countQuery += " AND Vision LIKE :Vision";
      replacements.Vision = `%${Vision}%`;
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

    const [team] = await sequelize.query(`select * from TeamMast where Type = 'FounderManagement'`)
    res.status(200).json({ data: results, totalCount, team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};

// Delete AboutUs
export const deleteAboutUs = async (req, res) => {
  const { AboutUkeyId } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM AboutUsMast WHERE AboutUkeyId = :AboutUkeyId";
    const result = await sequelize.query(query, { replacements: { AboutUkeyId } });    

    if (result[1] === 0) {
      return res.status(404).json({ error: "About Us record not found" });
    }

    res.status(200).json({ message: "About Us record deleted successfully", Success : true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success : false });
  } finally {
    await sequelize.close();
  }
};