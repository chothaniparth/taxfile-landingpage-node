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

    res.status(200).json({
      message: "Docs created successfully",
      inserted: FileNames.length,
      Success : true
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

    res.status(500).json({ error: err.message, Success : true });
  } finally {
    await sequelize.close();
  }
};

// Update Carousel
export const updateDoc = async (req, res) => {
  const { 
    DocUkeyId, Master, MasterUkeyId, Link, IsActive, UserName = req.user?.UserName, FileType, flag = "U" 
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress =
      req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";

    // get old doc
    const [oldDoc] = await sequelize.query(
      "SELECT FileName FROM DocMast WHERE DocUkeyId = :DocUkeyId",
      {
        replacements: { DocUkeyId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // ensure one new file uploaded
    if (!req.files?.FileName || req.files.FileName.length === 0) {
      return res.status(400).json({ error: "No file uploaded for update" });
    }

    const newFile = req.files.FileName[0].filename;

    // delete old DB row
    await sequelize.query(
      "DELETE FROM DocMast WHERE DocUkeyId = :DocUkeyId",
      { replacements: { DocUkeyId } }
    );

    // insert new doc
    await sequelize.query(
      `INSERT INTO DocMast (
          DocUkeyId, FileName, FileType, Master, MasterUkeyId, Link, 
          IsActive, IpAddress, EntryDate, UserName, flag
        )
        VALUES (
          :DocUkeyId, :FileName, :FileType, :Master, :MasterUkeyId, :Link, 
          :IsActive, :IpAddress, GETDATE(), :UserName, :flag
        )`,
      {
        replacements: {
          DocUkeyId,
          FileName: newFile,
          FileType,
          Master,
          MasterUkeyId,
          Link,
          IsActive,
          IpAddress,
          UserName,
          flag,
        },
      }
    );

    // delete old file if exists
    if (oldDoc?.FileName) {
      const oldPath = path.join("./media/Docs", oldDoc.FileName);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
        console.log("Deleted old file:", oldPath);
      }
    }

    res.status(200).json({
      message: "Document updated successfully",
      updatedFile: newFile,
      Success : true
    });
  } catch (err) {
    console.error("Error updating document:", err);
    res.status(500).json({ error: "Internal server error", Success : false });
  } finally {
    await sequelize.close();
  }
};

// Get AdminLogin (with optional filters)
export const getdoc = async (req, res) => {
  const { DocUkeyId, FileType, Master, MasterUkeyId, Link, IsActive, UserName, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = "SELECT * FROM DocMast WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as totalCount FROM DocMast WHERE 1=1";
    const replacements = {};

    if (DocUkeyId) {
      query += " AND DocUkeyId = :DocUkeyId";
      countQuery += " AND DocUkeyId = :DocUkeyId";
      replacements.DocUkeyId = DocUkeyId;
    }
    if (FileType) {
      query += " AND FileType = :FileType";
      countQuery += " AND FileType = :FileType";
      replacements.FileType = FileType;
    }
    if (Master) {
      query += " AND Master = :Master";
      countQuery += " AND Master = :Master";
      replacements.Master = Master;
    }
    if (IsActive !== undefined) {
      query += " AND IsActive = :IsActive";
      countQuery += " AND IsActive = :IsActive";
      replacements.IsActive = IsActive;
    }
    if (MasterUkeyId) {
      query += " AND MasterUkeyId = :MasterUkeyId";
      countQuery += " AND MasterUkeyId = :MasterUkeyId";
      replacements.MasterUkeyId = MasterUkeyId;
    }
    if (UserName) {
      query += " AND UserName = :UserName";
      countQuery += " AND UserName = :UserName";
      replacements.UserName = UserName;
    }
    if (Link) {
      query += " AND Link = :Link";
      countQuery += " AND Link = :Link";
      replacements.Link = Link;
    }

    // Always order by EntryDate DESC
    query += " ORDER BY EntryDate DESC";

    // Apply pagination if provided
    const pageNum = parseInt(Page, 10);
    const pageSizeNum = parseInt(PageSize, 10);

    if (!isNaN(pageNum) && !isNaN(pageSizeNum) && pageNum > 0 && pageSizeNum > 0) {
      const offset = (pageNum - 1) * pageSizeNum;
      query += " OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY";
      replacements.offset = offset;
      replacements.pageSize = pageSizeNum;
    }

    // Get total count
    const [countResult] = await sequelize.query(countQuery, { replacements });
    const totalCount = countResult[0]?.totalCount || 0;

    const [results] = await sequelize.query(query, { replacements });

    res.status(200).json({ data: results, totalCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};

// Delete Carousel
export const deleteDoc = async (req, res) => {
  const { DocUkeyId } = req.params;
  const sequelize = await dbConection();

  try {
    // 1. Get document info from DB
    const [doc] = await sequelize.query(
      "SELECT FileName FROM DocMast WHERE DocUkeyId = :DocUkeyId",
      {
        replacements: { DocUkeyId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    // 3. Delete file if exists
    if (doc.FileName) {
      fs.unlinkSync("./media/Docs" + "/" + doc.FileName);
    }

    // 4. Delete record from DB
    await sequelize.query(
      "DELETE FROM DocMast WHERE DocUkeyId = :DocUkeyId",
      { replacements: { DocUkeyId } }
    );

    res.status(200).json({ message: "Document deleted successfully", Success : true });
  } catch (err) {
    console.error("Error deleting document:", err);
    res.status(500).json({ error: "Database or file system error", Success : false });
  } finally {
    await sequelize.close();
  }
};