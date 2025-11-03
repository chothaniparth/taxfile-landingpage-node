import { dbConection } from "../config/db.js";

// Create / Update Inquiry
export const createInquiry = async (req, res) => {
  const {
    UkeyId = "", ProductUkeyId = "", inquiryMode = "", Name = "", CompanyName = "", Address = "", City = "", State = "", PinCode = "", Email = "", Mobile = "", Message = "", IsActive = true, UserName = req.user?.UserName || "System", flag = "A",
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
      (UkeyId, ProductUkeyId, inquiryMode, Name, CompanyName, Address, City, State, PinCode, Email, Mobile, Message, IsActive, IpAddress, EntryDate, UserName, flag)
      VALUES
      (:UkeyId, :ProductUkeyId, :inquiryMode, :Name, :CompanyName, :Address, :City, :State, :PinCode, :Email, :Mobile, :Message, :IsActive, :IpAddress, GETDATE(), :UserName, :flag);
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
      },
    });

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
  const { UkeyId, Name, CompanyName, Page, PageSize, ProductUkeyId, inquiryMode } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `select im.*, pm.ProductName from InquiryMast im
left join ProductMast pm on im.ProductUkeyId = pm.ProductUkeyId WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM InquiryMast WHERE 1=1`;
    const replacements = {};

    if (UkeyId) {
      query += " AND UkeyId = :UkeyId";
      countQuery += " AND UkeyId = :UkeyId";
      replacements.UkeyId = UkeyId;
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
