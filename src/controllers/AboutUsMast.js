import { dbConection } from "../config/db.js";

// Create / Update AboutUs
export const createAboutUs = async (req, res) => {
  const {
    AboutUkeyId = "", LongDetails = "", Mission = "", Vision = "", Core = "", Counter1 = 0, Counter2 = 0, Counter3 = 0, Counter4 = 0, UserName = req.user?.UserName || "System", flag = "A",
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
      (AboutUkeyId, LongDetails, Mission, Vision, Core, Counter1, Counter2, Counter3, Counter4, IpAddress, EntryDate, UserName, flag)
      VALUES
      (:AboutUkeyId, :LongDetails, :Mission, :Vision, :Core, :Counter1, :Counter2, :Counter3, :Counter4, :IpAddress, GETDATE(), :UserName, :flag);
    `;

    await sequelize.query(query, {
      replacements: {
        AboutUkeyId, LongDetails, Mission, Vision, Core, Counter1, Counter2, Counter3, Counter4, IpAddress, UserName, flag,
      },
    });

    res.status(201).json({
      message:
        flag === "A" ? "About Us record created successfully" : "About Us record updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};

// Get AboutUs (with optional filters)
export const getAboutUs = async (req, res) => {
  const { AboutUkeyId, Mission, Vision } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `SELECT * FROM AboutUsMast WHERE 1=1`;
    const replacements = {};

    if (AboutUkeyId) {
      query += " AND AboutUkeyId = :AboutUkeyId";
      replacements.AboutUkeyId = AboutUkeyId;
    }
    if (Mission) {
      query += " AND Mission LIKE :Mission";
      replacements.Mission = `%${Mission}%`;
    }
    if (Vision) {
      query += " AND Vision LIKE :Vision";
      replacements.Vision = `%${Vision}%`;
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

    res.json({ message: "About Us record deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};