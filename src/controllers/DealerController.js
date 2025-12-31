import { dbConection } from "../config/db.js";

// Create / Update Dealer
export const createDealer = async (req, res) => {
  const {
    DealerCguid, CityID = null, DesignationID = null, rCityID = null, DealerPartyID = null, 
    DOB = null, DOJ = null, DOA = null, BlackListed = null, DealerName, Address1 = null, Address2 = null, 
    Address3 = null, Address4 = null, MobileNo = null, rAddress3 = null, rAddress4 = null, rMobileNo = null, 
    rPhoneNo = null, rFaxNo = null, PhoneNo = null, FirmName = null, FaxNo = null, Email = null, rAddress1 = null, 
    rAddress2 = null, CustomerID = null, DealerFileCode = null, AcName = null, BankName = null, AcNo = null, 
    IsActive = null, MobileNo2 = null, MobileNo3 = null, IsLocalDealer = null, IsST = null, FirmID = null, 
    dTerms1 = null, dTerms2 = null, dTerms3 = null, BillingFirmID = null, opening = null, IsPrint = null, 
    IsIncludeST = null, GSTNo = null, BankId = null, CompanyEmail = null, Password = null, Flag = null, 
    UserName = req.user?.UserName || "System", Dealerlevelcguid = "", ParentDealerCguid = "" ,flag = "A"
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";
    let query = "";

    if (flag === "U") {
      query += `
        DELETE FROM Dealer WHERE DealerCguid = :DealerCguid;
      `;
    }

    query += `
      INSERT INTO Dealer
      (DealerCguid, CityID, DesignationID, rCityID, DealerPartyID, DOB, DOJ, DOA, BlackListed, DealerName, Address1, Address2, Address3, Address4, MobileNo, rAddress3, rAddress4, rMobileNo, rPhoneNo, rFaxNo, PhoneNo, FirmName, FaxNo, Email, rAddress1, rAddress2, CustomerID, DealerFileCode, AcName, BankName, AcNo, IsActive, MobileNo2, MobileNo3, IsLocalDealer, IsST, FirmID, dTerms1, dTerms2, dTerms3, BillingFirmID, opening, IsPrint, IsIncludeST, GSTNo, BankId, CompanyEmail, Password, Flag, IpAddress, EntryDate, UserName, Dealerlevelcguid, ParentDealerCguid)
      VALUES
      (:DealerCguid, :CityID, :DesignationID, :rCityID, :DealerPartyID, :DOB, :DOJ, :DOA, :BlackListed, :DealerName, :Address1, :Address2, :Address3, :Address4, :MobileNo, :rAddress3, :rAddress4, :rMobileNo, :rPhoneNo, :rFaxNo, :PhoneNo, :FirmName, :FaxNo, :Email, :rAddress1, :rAddress2, :CustomerID, :DealerFileCode, :AcName, :BankName, :AcNo, :IsActive, :MobileNo2, :MobileNo3, :IsLocalDealer, :IsST, :FirmID, :dTerms1, :dTerms2, :dTerms3, :BillingFirmID, :opening, :IsPrint, :IsIncludeST, :GSTNo, :BankId, :CompanyEmail, :Password, :Flag, :IpAddress, GETDATE(), :UserName,
      :Dealerlevelcguid :ParentDealerCguid);
    `;

    await sequelize.query(query, {
      replacements: {
        DealerCguid, CityID, DesignationID, rCityID, DealerPartyID, DOB, DOJ, DOA, BlackListed, DealerName, Address1, Address2, Address3, Address4, MobileNo, rAddress3, rAddress4, rMobileNo, rPhoneNo, rFaxNo, PhoneNo, FirmName, FaxNo, Email, rAddress1, rAddress2, CustomerID, DealerFileCode, AcName, BankName, AcNo, IsActive, MobileNo2, MobileNo3, IsLocalDealer, IsST, FirmID, dTerms1, dTerms2, dTerms3, BillingFirmID, opening, IsPrint, IsIncludeST, GSTNo, BankId, CompanyEmail, Password, Flag, IpAddress, UserName, Dealerlevelcguid, ParentDealerCguid
      },
    });

    res.status(200).json({
      message:
        flag === "A" ? "Dealer record created successfully" : "Dealer record updated successfully", Success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

// Get Dealer (with optional filters)
export const getDealer = async (req, res) => {
  const { DealerCguid, DealerName, CityID, Page, PageSize } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `SELECT d.*, c.CityName, dg.DesignationName FROM Dealer d
    left join City c on c.CityID = d.CityID
    left join Designation dg on d.DesignationID = dg.DesignationID WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM Dealer d WHERE 1=1`;
    const replacements = {};

    if (DealerCguid) {
      query += " AND d.DealerCguid = :DealerCguid";
      countQuery += " AND d.DealerCguid = :DealerCguid";
      replacements.DealerCguid = DealerCguid;
    }
    if (DealerName) {
      query += " AND d.DealerName LIKE :DealerName";
      countQuery += " AND d.DealerName LIKE :DealerName";
      replacements.DealerName = `%${DealerName}%`;
    }
    if (CityID) {
      query += " AND d.CityID = :CityID";
      countQuery += " AND d.CityID = :CityID";
      replacements.CityID = CityID;
    }

    // Order by DealerID DESC
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

    res.status(200).json({ data: results, totalCount, Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error", Success: false });
  } finally {
    await sequelize.close();
  }
};

// Delete Dealer
export const deleteDealer = async (req, res) => {
  const { DealerCguid } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM Dealer WHERE DealerCguid = :DealerCguid";
    const result = await sequelize.query(query, { replacements: { DealerCguid } });

    if (result[1] === 0) {
      return res.status(404).json({ error: "Dealer record not found" });
    }

    res.status(200).json({ message: "Dealer record deleted successfully", Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};
