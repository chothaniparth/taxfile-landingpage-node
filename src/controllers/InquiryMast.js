import { dbConection } from "../config/db.js";
import { sendBulkEmails } from "../services/email.js";

// Create / Update Inquiry
export const createInquiry = async (req, res) => {
  const {
    UkeyId = "", ProductUkeyId = "", inquiryMode = "", Name = "", CompanyName = "", Address = "", City = "", State = "", PinCode = "", Email = "", Mobile = "", Message = "", IsActive = true, UserName = req.user?.UserName || "System", flag = "A", Status = "", EstablishmentYear = "", PAN = "", GST = "", ContactPerson = "", Remark1 = "", Remark2 = "", Remark3 = "", Remark4 = "", Remark5 = "", Remark6 = "", Subject = "", ExpStartDate = "" , Industry = "", ExpBudget = "",InqueryModeName = ''
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";

    let query = "";

    // For update, delete the existing record with the same UkeyId
    if (flag === "U") {
      query += `
        DELETE FROM InquiryMast WHERE UkeyId = :UkeyId;
      `;
    }

    query += `
      INSERT INTO InquiryMast
      (UkeyId, ProductUkeyId, inquiryMode, Name, CompanyName, Address, City, State, PinCode, Email, Mobile, Message, IsActive, IpAddress, EntryDate, UserName, flag, Status, EstablishmentYear, PAN, GST, ContactPerson, Remark1, Remark2, Remark3, Remark4, Remark5, Remark6, Subject, ExpStartDate, Industry, ExpBudget)
      VALUES
      (:UkeyId, :ProductUkeyId, :inquiryMode, :Name, :CompanyName, :Address, :City, :State, :PinCode, :Email, :Mobile, :Message, :IsActive, :IpAddress, GETDATE(), :UserName, :flag, :Status, :EstablishmentYear, :PAN, :GST, :ContactPerson, :Remark1, :Remark2, :Remark3, :Remark4, :Remark5, :Remark6, :Subject, :ExpStartDate, :Industry, :ExpBudget);
    `;

    await sequelize.query(query, {
      replacements: {
        UkeyId,
        ProductUkeyId,
        inquiryMode,
        Name,
        CompanyName,
        Address,
        City,
        State,
        PinCode,
        Email,
        Mobile,
        Message,
        IsActive,
        IpAddress,
        UserName,
        flag,
        Status,
        EstablishmentYear,
        PAN,
        GST,
        ContactPerson,
        Remark1,
        Remark2,
        Remark3,
        Remark4,
        Remark5,
        Remark6,
        Subject,
        ExpStartDate,
        Industry,
        ExpBudget
      },
    });
    let ProductName 

    if(ProductUkeyId) {
       ProductName = await sequelize.query(`select * from ProductMast where ProductUkeyId = '${ProductUkeyId}'`)
    }
    console.log(ProductName);
    
    const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body {
          font-family: Arial, Helvetica, sans-serif;
          background-color: #f4f6f8;
          padding: 20px;
        }
        .container {
          max-width: 650px;
          margin: auto;
          background: #ffffff;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .header {
          background: #0d6efd;
          color: #ffffff;
          padding: 15px 20px;
          font-size: 18px;
          font-weight: bold;
        }
        .content {
          padding: 20px;
          color: #333;
          font-size: 14px;
          line-height: 1.6;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        table td {
          padding: 8px;
          border-bottom: 1px solid #eee;
        }
        table td.label {
          font-weight: bold;
          width: 35%;
          background: #f8f9fa;
        }
        .footer {
          padding: 12px 20px;
          background: #f1f1f1;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <div class="header">
          New Inquiry Received
        </div>

        <div class="content">
          <p>You have received a new inquiry with the following details:</p>

          <table>
            <tr>
              <td class="label">Inquiry Mode</td>
              <td>${InqueryModeName}</td>
            </tr>
            ${ProductUkeyId && ProductName?.[0]?.[0]?.ProductName ? `
            <tr>
              <td class="label">Product Name</td>
              <td>${ProductName?.[0]?.[0]?.ProductName}</td>
            </tr>
            ` : ''}
            <tr>
              <td class="label">Name</td>
              <td>${Name}</td>
            </tr>
            <tr>
              <td class="label">Company Name</td>
              <td>${CompanyName}</td>
            </tr>
            <tr>
              <td class="label">Email</td>
              <td>${Email}</td>
            </tr>
            <tr>
              <td class="label">Mobile</td>
              <td>${Mobile}</td>
            </tr>
            <tr>
              <td class="label">City / State</td>
              <td>${City}, ${State}</td>
            </tr>
            <tr>
              <td class="label">Industry</td>
              <td>${Industry}</td>
            </tr>
            <tr>
              <td class="label">Expected Budget</td>
              <td>${ExpBudget}</td>
            </tr>
            <tr>
              <td class="label">Message</td>
              <td>${Message}</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          This inquiry was generated from the system on ${new Date().toLocaleString()}.
        </div>
      </div>
    </body>
    </html>
    `;

    if(flag == 'A'){
      sendBulkEmails([{email : 'helpsurat@gmail.com'}], `There is an inquiry for ${InqueryModeName}`, emailHTML)
    }

    res.status(200).json({
      message: flag === "A" ? "Inquiry created successfully" : "Inquiry updated successfully",
      Success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

// Get Inquiry (with optional filters)
export const getInquiries = async (req, res) => {
  const { UkeyId, Name, CompanyName, Page, PageSize, ProductUkeyId, inquiryMode, Status } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `select im.*, pm.ProductName, dm.FileName, dm.DocUkeyId, dm.FileType from InquiryMast im
left join ProductMast pm on im.ProductUkeyId = pm.ProductUkeyId 
left join DocMast dm on dm.MasterUkeyId = im.UkeyId
WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM InquiryMast WHERE 1=1`;
    const replacements = {};

    if (UkeyId) {
      query += " AND im.UkeyId = :UkeyId";
      countQuery += " AND UkeyId = :UkeyId";
      replacements.UkeyId = UkeyId;
    }
    if (Status) {
      query += " AND im.Status = :Status";
      countQuery += " AND Status = :Status";
      replacements.Status = Status;
    }
    if (ProductUkeyId) {
      query += " AND pm.ProductUkeyId = :ProductUkeyId";
      countQuery += " AND ProductUkeyId = :ProductUkeyId";
      replacements.ProductUkeyId = ProductUkeyId;
    }
    if (inquiryMode) {
      query += " AND im.inquiryMode = :inquiryMode";
      countQuery += " AND inquiryMode = :inquiryMode";
      replacements.inquiryMode = inquiryMode;
    }
    if (Name) {
      query += " AND Name LIKE :Name";
      countQuery += " AND Name LIKE :Name";
      replacements.Name = `%${Name}%`;
    }
    if (CompanyName) {
      query += " AND CompanyName LIKE :CompanyName";
      countQuery += " AND CompanyName LIKE :CompanyName";
      replacements.CompanyName = `%${CompanyName}%`;
    }

    // Always order by EntryDate DESC
    query += " ORDER BY EntryDate DESC";

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

// Delete Inquiry
export const deleteInquiry = async (req, res) => {
  const { UkeyId } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM InquiryMast WHERE UkeyId = :UkeyId";
    const result = await sequelize.query(query, { replacements: { UkeyId } });

    if (result[1] === 0) {
      return res.status(404).json({ error: "Inquiry not found", Success: false });
    }

    res.status(200).json({ message: "Inquiry deleted successfully", Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};
