import { getMasterConnection } from "../config/db.js";
import { generateJWTT } from "../utils/jwt.js";

// Create User
export const createUser = async (req, res) => {
  const { UserUkeyId, Name, Email, Mobile1, Mobile2, Password } = req.body;
  const sequelize = await getMasterConnection();

  try {
    const query = `
      INSERT INTO Users (UserUkeyId, Name, Email, Mobile1, Mobile2, Password)
      VALUES (:UserUkeyId, :Name, :Email, :Mobile1, :Mobile2, :Password);
    `;

    await sequelize.query(query, {
      replacements: { UserUkeyId, Name, Email, Mobile1, Mobile2, Password },
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};

// Get Users (with optional filters)
export const getUsers = async (req, res) => {
  const { UserId, UserUkeyId, Name, Email, Mobile1, Mobile2 } = req.query;
  const sequelize = await getMasterConnection();

  try {
    let query = "SELECT * FROM Users WHERE 1=1";
    const replacements = {};

    if (UserId) {
      query += " AND UserId = :UserId";
      replacements.UserId = UserId;
    }
    if (UserUkeyId) {
      query += " AND UserUkeyId = :UserUkeyId";
      replacements.UserUkeyId = UserUkeyId;
    }
    if (Name) {
      query += " AND Name LIKE :Name";
      replacements.Name = `%${Name}%`;
    }
    if (Email) {
      query += " AND Email = :Email";
      replacements.Email = Email;
    }
    if (Mobile1) {
      query += " AND Mobile1 = :Mobile1";
      replacements.Mobile1 = Mobile1;
    }
    if (Mobile2) {
      query += " AND Mobile2 = :Mobile2";
      replacements.Mobile2 = Mobile2;
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

// Update User
export const updateUser = async (req, res) => {
  const { UserUkeyId, Name, Email, Mobile1, Mobile2, Password } = req.body;
  const sequelize = await getMasterConnection();

  try {
    const query = `
      UPDATE Users
      SET Name = :Name,
          Email = :Email,
          Mobile1 = :Mobile1,
          Mobile2 = :Mobile2,
          Password = :Password
      WHERE UserUkeyId = :UserUkeyId
    `;

    await sequelize.query(query, {
      replacements: { UserUkeyId, Name, Email, Mobile1, Mobile2, Password },
    });

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  const { UserUkeyId } = req.params;
  const sequelize = await getMasterConnection();

  try {
    const query = "DELETE FROM Users WHERE UserUkeyId = :UserUkeyId";
    await sequelize.query(query, { replacements: { UserUkeyId } });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};
