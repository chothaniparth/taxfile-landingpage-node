import { dbConection } from "../config/db.js";

// Create / Update YTvideo
export const createYTvideo = async (req, res) => {
  const {
    UkeyId = '',
    ProductUkeyId = '',
    URL = '',
    IsActive = true,
    UserName = req.user.UserName,
    flag = 'A'
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress =
      req?.headers['x-forwarded-for'] ||
      req?.socket?.remoteAddress ||
      'Not Found';

    let query = "";

    if (flag === 'U') {
      query += `
        DELETE FROM YTvideoMast WHERE UkeyId = :UkeyId;
      `;
    }

    query += `
      INSERT INTO YTvideoMast (UkeyId, ProductUkeyId, URL, IsActive, IpAddress, EntryDate, UserName, flag)
      VALUES (:UkeyId, :ProductUkeyId, :URL, :IsActive, :IpAddress, GETDATE(), :UserName, :flag);
    `;

    await sequelize.query(query, {
      replacements: { UkeyId, ProductUkeyId, URL, IsActive, IpAddress, UserName, flag },
    });

    res.status(201).json({
      message: flag === "A" ? "YT video created successfully" : "YT video updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};

// Get YTvideo (with optional filters)
export const getYTvideo = async (req, res) => {
  const { UkeyId, ProductUkeyId, URL, IsActive } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `SELECT * FROM YTvideoMast WHERE 1=1 `;
    const replacements = {};

    if (UkeyId) {
      query += " AND UkeyId = :UkeyId";
      replacements.UkeyId = UkeyId;
    }
    if (ProductUkeyId) {
      query += " AND ProductUkeyId = :ProductUkeyId";
      replacements.ProductUkeyId = ProductUkeyId;
    }
    if (URL) {
      query += " AND URL = :URL";
      replacements.URL = URL;
    }
    if (IsActive) {
      query += " AND IsActive = :IsActive";
      replacements.IsActive = IsActive;
    }

    const [results] = await sequelize.query(query, { replacements });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};

// Delete YTvideo
export const deleteYTvideo = async (req, res) => {
  const { UkeyId } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM YTvideoMast WHERE UkeyId = :UkeyId";
    const result = await sequelize.query(query, { replacements: { UkeyId } });
    
    if (!result[1].rowCount) {
      return res.status(404).json({ error: "YT video not found" });
    }

    res.json({ message: "YT video deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};
