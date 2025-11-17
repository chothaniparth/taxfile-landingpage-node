import { dbConection } from "../config/db.js";
import { generateJWTT } from "../utils/jwt.js";1

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
  const { UserId, UserUkeyId, Name, Email, Mobile1, Mobile2 } = req.query;
  const sequelize = await dbConection();

  try {
    let query = "SELECT * FROM AdminLogin WHERE 1=1";
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
    const { UserUkeyId, Name, Email, Mobile1, Mobile2, Password, CustId, UserName, IsActive } = req.body;
    const sequelize = await dbConection();
    const IpAddress = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || 'Not Found';

    try {
    const query = `
        UPDATE AdminLogin
        SET Name = :Name,
            Email = :Email,
            Mobile1 = :Mobile1,
            Mobile2 = :Mobile2,
            Password = :Password,
            CustId = :CustId,
            UserName = :UserName,
            IsActive = :IsActive,
            IpAddress = :IpAddress,
            EntryDate = GETDATE()
        WHERE UserUkeyId = :UserUkeyId
    `;

    await sequelize.query(query, {
        replacements: { UserUkeyId, Name, Email, Mobile1, Mobile2, Password, CustId, UserName, IsActive, IpAddress },
    });

    res.status(200).json({ message: "User updated successfully", Success : true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success : false });
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
    const { UserName, Password, Mode = 'Admin', CustomerId, Mobile1, Email1 } = req.body;
    const sequelize = await dbConection();

    try {
      let query = ''

      if(Mode == 'Admin'){
        query = `
            SELECT * FROM AdminLogin WHERE UserName = :UserName AND Password = :Password
        `;
      }
      else if(Mode == 'User'){
        if(CustomerId){
          query = `select * from Party where CustomerId = :CustomerId and CustomerPassword = :Password and IsActive = 1`
        }else if(Mobile1){
          query = `select * from Party where Mobile1 = :Mobile1 and CustomerPassword = :Password and IsActive = 1`
        }else if(Email1){
          query = `select * from Party where Email1 = :Email1 and CustomerPassword = :Password and IsActive = 1`
        }
      }
        const [user] = await sequelize.query(query, {
            replacements: { UserName, Password, CustomerId, Mobile1, Email1},
        });
      
        if (!user || user.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
      
        const token = generateJWTT(Mode == 'Admin' ? {
          UserId: user[0].UserId,
          UserName: user[0].UserName,
          UserUkeyId: user[0].UserUkeyId,
          Email: user[0].Email,
          Role: Mode
        } : {
          Role: Mode,
          CustomerId : user[0].CustomerId, 
          Mobile1 : user[0].Mobile1, 
          Email1 : user[0].Email1
        });
      
        res.status(200).json({ 
          token, CustId : user[0].CustId, 
          UserUkeyId: user[0].UserUkeyId, Email: user[0].Email, UserName: user[0].UserName, Role: Mode, Success : true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message, Success : false });
    } finally {
        await sequelize.close();
    }
};

export const forgetPassword = async (req, res) => {
  const { Password, Mobile1 } = req.body;   // FIXED typo
  const sequelize = await dbConection();

  try {

    if (!Password || !Mobile1) {
      return res.status(400).json({
        Success: false,
        error: "Password and Mobile1 are required",
      });
    }

    const [result] = await sequelize.query(
      `UPDATE Party 
       SET CustomerPassword = :Password 
       WHERE Mobile1 = :Mobile1 AND IsActive = 1`,
      {
        replacements: { Password, Mobile1 },
      }
    );    

    if (result === 0) {
      return res.status(400).json({
        Success: false,
        error: "No active user found with the given mobile number."
      });
    }

    return res.status(200).json({
      Success: true,
      message: "Password updated successfully."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message, Success: false });
  } finally {
    await sequelize.close();
  }
};
