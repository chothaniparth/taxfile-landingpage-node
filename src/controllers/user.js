import { dbConection } from "../config/db.js";
import Users from "../models/user.js";
import { generateJWTT } from "../utils/jwt.js";


// Create User
export const createUser = async (req, res) => {
  const { UserUkeyId, Name, Email, Mobile1, Mobile2, Password } = req.body;
  const sequelize = await dbConection();

  try {
    const query = `
      INSERT INTO AdminLogin (UserUkeyId, Name, Email, Mobile1, Mobile2, Password)
      VALUES (:UserUkeyId, :Name, :Email, :Mobile1, :Mobile2, :Password);
    `;

    await sequelize.query(query, {
      replacements: { UserUkeyId, Name, Email, Mobile1, Mobile2, Password },
    });

    res.status(200).json({ message: "User created successfully", Success : true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success : false });
  } finally {
    await sequelize.close();
  }
};

// Get AdminLogin (with optional filters)
export const getUsers = async (req, res) => {
  const sequelize = await dbConection();
  try {
    const results = await Users.findAll({ where : {...req.query}});
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};

export const updateUser = async (req, res) => {
  const sequelize = await dbConection();
  const IpAddress = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || 'Not Found';

  try {
    await Users.update(
      {
        ...req.body,
        IpAddress,
        EntryDate: new Date().toJSON().toString(), // ✅ Correctly set current datetime
      },
      {
        where: { UserUkeyId: req.body.UserUkeyId }, // ✅ only use the key for matching
      }
    );

    res.status(200).json({ message: "User updated successfully", Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  const { UserUkeyId } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM AdminLogin WHERE UserUkeyId = :UserUkeyId";
    await sequelize.query(query, { replacements: { UserUkeyId } });

    res.status(200).json({ message: "User deleted successfully", Success : true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success : false });
  } finally {
    await sequelize.close();
  }
};

// LOGIN (Generate JWT)
export const loginUser = async (req, res) => {
    const { UserName, Password } = req.body;
    const sequelize = await dbConection();

    try {
      const user = await Users.findAll({ where : { UserName, Password } })        
    
      if (!user || user.length === 0) return res.status(401).json({ error: "Invalid credentials" });
    
      const token = generateJWTT({
          UserId: user[0].UserId,
          UserName: user[0].UserName,
          UserUkeyId: user[0].UserUkeyId,
          Email: user[0].Email,
      });
    
      res.status(200).json({ token, CustId : user[0].CustId, UserUkeyId: user[0].UserUkeyId, Email: user[0].Email, UserName: user[0].UserName, Success : true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message, Success : false });
    } finally {
        await sequelize.close();
    }
};
