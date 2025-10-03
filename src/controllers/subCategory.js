import { dbConection } from "../config/db.js";

// Create Update Carousel
export const createSubCategory = async (req, res) => {
  const { SubUkeyId = '', SubCateName = '', CategoryId = '', IsActive = true, UserName = req.user.UserName, flag = 'A' } = req.body;
  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || 'Not Found';

    let query = ""

    if (flag === 'U') {
      query += `
        DELETE FROM  SubCateMast WHERE SubUkeyId = :SubUkeyId;
      `
    }

    query += `
      INSERT INTO  SubCateMast (SubUkeyId, SubCateName, CategoryId, IsActive, IpAddress, EntryDate, UserName, flag)
      VALUES (:SubUkeyId, :SubCateName, :CategoryId, :IsActive, :IpAddress, GETDATE(), :UserName, :flag);
    `;

    await sequelize.query(query, {
      replacements: { SubUkeyId, SubCateName, CategoryId, IsActive, IpAddress, UserName, flag },
    });

    res.status(201).json({
      message: flag === "A" ? "Sub Category created successfully" : "Sub Category updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};

// Get AdminLogin (with optional filters)
export const getSubCategory = async (req, res) => {
  const { SubUkeyId, SubCateName, CategoryId, IsActive } = req.query;
  const sequelize = await dbConection();

  try {
    let query = "SELECT * FROM  SubCateMast WHERE 1=1";
    const replacements = {};

    if (SubUkeyId) {
      query += " AND SubUkeyId = :SubUkeyId";
      replacements.SubUkeyId = SubUkeyId;
    }
    if (SubCateName) {
      query += " AND SubCateName = :SubCateName";
      replacements.SubCateName = SubCateName;
    }
    if (CategoryId) {
      query += " AND CategoryId LIKE :CategoryId";
      replacements.CategoryId = `%${CategoryId}%`;
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

// Delete Carousel
export const deleteSubCategory = async (req, res) => {
  const { SubUkeyId } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM  SubCateMast WHERE SubUkeyId = :SubUkeyId";
    await sequelize.query(query, { replacements: { SubUkeyId } });

    res.json({ message: "Sub category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};