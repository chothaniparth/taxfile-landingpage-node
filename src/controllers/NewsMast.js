import { dbConection } from "../config/db.js";

// CREATE / UPDATE News
export const createNews = async (req, res) => {
  const {
    UkeyId, Title = "", Descrption = "", NewsDate = null, IsActive = true, IsDeleted = false, UserName = req.user?.UserName, flag = "A",
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";

    let query = "";

    if (flag === "U") {
      query += `
        DELETE FROM NewsMast WHERE UkeyId = :UkeyId;
      `;
    }

    query += `
      INSERT INTO NewsMast
        (UkeyId, Title, Descrption, NewsDate, IsActive, IsDeleted, IpAddress, EntryDate, UserName, flag)
      VALUES
        (:UkeyId, :Title, :Descrption, :NewsDate, :IsActive, :IsDeleted, :IpAddress, GETDATE(), :UserName, :flag);
    `;

    await sequelize.query(query, {
      replacements: { Title, Descrption, NewsDate, IsActive, IsDeleted, IpAddress, UserName, flag, UkeyId },
    });

    res.status(201).json({
      message: flag === "A" ? "News created successfully" : "News updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};

// GET News (with optional filters)
export const getNews = async (req, res) => {
  const { UkeyId, Title, IsActive, IsDeleted } = req.query;
  const sequelize = await dbConection();

  try {
    let query = "SELECT * FROM NewsMast WHERE 1=1";
    const replacements = {};

    if (UkeyId) {
      query += " AND UkeyId = :UkeyId";
      replacements.UkeyId = UkeyId;
    }
    if (Title) {
      query += " AND Title LIKE :Title";
      replacements.Title = `%${Title}%`;
    }
    if (IsActive !== undefined) {
      query += " AND IsActive = :IsActive";
      replacements.IsActive = IsActive;
    }
    if (IsDeleted !== undefined) {
      query += " AND IsDeleted = :IsDeleted";
      replacements.IsDeleted = IsDeleted;
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

// DELETE News
export const deleteNews = async (req, res) => {
  const { UkeyId } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM NewsMast WHERE UkeyId = :UkeyId";
    const result = await sequelize.query(query, { replacements: { UkeyId } });

    if (result[1] === 0) {
      return res.status(404).json({ error: "News record not found" });
    }

    res.json({ message: "News deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};
