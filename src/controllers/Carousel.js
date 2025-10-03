import { dbConection } from "../config/db.js";

// Create Update Carousel
export const createCarousel = async (req, res) => {
  const { UkeyId, Title = '', Name = '', IsDoc = false, IsActive = true, OrderId = 1, UserName = '', flag = 'A' } = req.body;
  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || 'Not Found';

    let query = ""

    if (flag === 'U') {
      query += `
        DELETE FROM carouselmast WHERE UkeyId = :UkeyId;
      `
    }

    query += `
      INSERT INTO carouselmast (UkeyId, Title, Name, IsDoc, IsActive, OrderId, IpAddress, EntryDate, UserName, flag)
      VALUES (:UkeyId, :Title, :Name, :IsDoc, :IsActive, :OrderId, :IpAddress, GETDATE(), :UserName, :flag);
    `;

    await sequelize.query(query, {
      replacements: { UkeyId, Title, Name, IsDoc, IsActive, OrderId, IpAddress, UserName, flag },
    });

    res.status(201).json({
      message: flag === "A" ? "Carousel created successfully" : "Carousel updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};

// Get AdminLogin (with optional filters)
export const getCarousel = async (req, res) => {
  const { UkeyId, Title, Name, IsDoc, IsActive, OrderId, UserName } = req.query;
  const sequelize = await dbConection();

  try {
    let query = "SELECT * FROM carouselmast WHERE 1=1";
    const replacements = {};

    if (UkeyId) {
      query += " AND UkeyId = :UkeyId";
      replacements.UkeyId = UkeyId;
    }
    if (Title) {
      query += " AND Title = :Title";
      replacements.Title = Title;
    }
    if (Name) {
      query += " AND Name LIKE :Name";
      replacements.Name = `%${Name}%`;
    }
    if (IsDoc) {
      query += " AND IsDoc = :IsDoc";
      replacements.IsDoc = IsDoc;
    }
    if (IsActive) {
      query += " AND IsActive = :IsActive";
      replacements.IsActive = IsActive;
    }
    if (OrderId) {
      query += " AND OrderId = :OrderId";
      replacements.OrderId = OrderId;
    }
    if (UserName) {
      query += " AND UserName = :UserName";
      replacements.UserName = UserName;
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

// Delete Carousel
export const deleteCarousel = async (req, res) => {
  const { UkeyId } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM carouselmast WHERE UkeyId = :UkeyId";
    await sequelize.query(query, { replacements: { UkeyId } });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};