import fs from "fs";
import path from "path";
import { dbConection } from "../config/db.js";

// Create Carousel
export const createDoc = async (req, res) => {
  const { Master, MasterUkeyId, Link, IsActive, UserName = req.user.UserName, FileType, flag = "A" } = req.body;
  const FileNames = req.files?.FileName?.map(file => file.filename) || [];

  const sequelize = await dbConection();
  const transaction = await sequelize.transaction(); // start transaction

  try {
    if (!FileNames.length) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const IpAddress =
      req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";

    let query = "", replacements = {};

    FileNames.forEach((file, idx) => {
      query += `
        INSERT INTO DocMast 
        (DocUkeyId, FileName, FileType, Master, MasterUkeyId, Link, IsActive, IpAddress, EntryDate, UserName, flag)
        VALUES (newid(), :FileName${idx}, :FileType, :Master, :MasterUkeyId, :Link, :IsActive, :IpAddress, GETDATE(), :UserName, :flag);
      `;

      replacements[`FileName${idx}`] = file;
    });

    Object.assign(replacements, {
      Master, MasterUkeyId, Link, IsActive, UserName, flag, IpAddress, FileType,
    });

    await sequelize.query(query, { replacements, transaction });

    await transaction.commit();

    res.status(201).json({
      message: "Docs created successfully",
      inserted: FileNames.length,
    });
  } catch (err) {
    console.error("Error inserting docs:", err);

    // Rollback transaction if error
    if (transaction) await transaction.rollback();

    // Delete uploaded files if DB insert fails
    if (FileNames.length > 0) {
      FileNames.forEach((file) => {
        try {
          const filePath = path.join("media", file); // adjust if your multer path differs
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
          }
        } catch (unlinkErr) {
          console.error("Error deleting file:", unlinkErr);
        }
      });
    }

    res.status(500).json({ error: "Database error, files deleted" });
  } finally {
    await sequelize.close();
  }
};

// Create Update Carousel
export const updateDoc = async (req, res) => {
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
export const getdoc = async (req, res) => {
  const { DocUkeyId, FileType, Master, MasterUkeyId, Link, IsActive, UserName } = req.query;
  const sequelize = await dbConection();

  try {
    let query = "SELECT * FROM DocMast WHERE 1=1";
    const replacements = {};

    if (DocUkeyId) {
      query += " AND DocUkeyId = :DocUkeyId";
      replacements.DocUkeyId = DocUkeyId;
    }
    if (FileType) {
      query += " AND FileType = :FileType";
      replacements.FileType = FileType;
    }
    if (Master) {
      query += " AND Master = :Master";
      replacements.Master = Master;
    }
    if (IsActive) {
      query += " AND IsActive = :IsActive";
      replacements.IsActive = IsActive;
    }
    if (MasterUkeyId) {
      query += " AND MasterUkeyId = :MasterUkeyId";
      replacements.MasterUkeyId = MasterUkeyId;
    }
    if (UserName) {
      query += " AND UserName = :UserName";
      replacements.UserName = UserName;
    }
    if (Link) {
      query += " AND Link = :Link";
      replacements.Link = Link;
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
export const deleteDoc = async (req, res) => {
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