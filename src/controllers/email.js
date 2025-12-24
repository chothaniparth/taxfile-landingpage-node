import { dbConection } from "../config/db.js";

export const createEmail = async (req, res) => {
  const { id = '', Email = '', Password = '', IsActive = true, MailServer = '' , ServerName = '',  Flag = 'A' } = req.body;
  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || 'Not Found';

    let query = ""

    if (Flag === "U") {

      if (!id) {
        return res.status(400).json({ message: "ID is required for update", Success: false });
      }

      const result = await sequelize.query(`
      UPDATE MailSetting set 
      Email = :Email, 
      Password = :Password,
      IsActive = :IsActive,
      MailServer = :MailServer,
      ServerName = :ServerName,
      IpAddress = :IpAddress,
      EntryTime = GETDATE(),
      Flag = :Flag
      where id = :id`,
        {
          replacements: {
            id, Email, Password, IsActive, MailServer, ServerName, IpAddress, Flag
          },
        });

      // console.log("result => ", result);

      return res.status(200).json({
        message: "Email Updated Successfully",
        Success: true
      });
    }

    query += `
      INSERT INTO MailSetting (Email, Password, IsActive, MailServer, ServerName, IpAddress, EntryTime, Flag)
      VALUES (:Email, :Password, :IsActive, :MailServer, :ServerName, :IpAddress, GETDATE(), :Flag);
    `;

    await sequelize.query(query, {
      replacements: { Email, Password, IsActive, MailServer, ServerName, IpAddress, Flag },
    });

    res.status(200).json({
      message: "Email Created Successfully", Success : true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success : false });
  } finally {
    await sequelize.close();
  }
};

export const getEmail = async (req, res) => {
  const { Email, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = "SELECT * FROM MailSetting WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as totalCount FROM MailSetting cm WHERE 1=1";
    const replacements = {};

    if (Email) {
      query += " AND Email = :Email";
      countQuery += " AND Email = :Email";
      replacements.Email = Email;
    }
    
    // Always order by EntryDate DESC
    query += " ORDER BY EntryTime DESC";

    // Get total count
    const [countResult] = await sequelize.query(countQuery, { replacements });
    const totalCount = countResult[0]?.totalCount || 0;

    // Apply pagination if provided
    const pageNum = parseInt(Page, 10);
    const pageSizeNum = parseInt(PageSize, 10);

    if (!isNaN(pageNum) && !isNaN(pageSizeNum) && pageNum > 0 && pageSizeNum > 0) {
      const offset = (pageNum - 1) * pageSizeNum;
      query += " OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY";
      replacements.offset = offset;
      replacements.pageSize = pageSizeNum;
    }

    const [results] = await sequelize.query(query, { replacements });
    res.status(200).json({ data: results, totalCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};

export const deleteEmail = async (req, res) => {
  const { id } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM MailSetting WHERE id = :id";
    await sequelize.query(query, { replacements: { id } });

    res.status(200).json({ message: "Email deleted successfully", Success : true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success : false });
  } finally {
    await sequelize.close();
  }
};