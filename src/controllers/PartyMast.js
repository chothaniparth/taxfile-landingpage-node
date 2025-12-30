import { dbConection } from "../config/db.js";

// Create / Update Party
export const createParty = async (req, res) => {
  const {
    CityID = null, xCityID = null, PinCodeID = null, xPinCodeID = null, PinCode = null, ParentID = null, Balance = null, EmailStatusID = null, xPinCode = null, AreaID = null, xAreaID = null, DealerID = null, DesignationID = null, GroupUkeyId = null, DOB = null, DOJ = null, OldDOJ = null, DOA = null, EmailDate = null, IsActive = false, BlackListed = false, IsTeamViewer = false, IsPrint = false, IsSuspend = false, IsCDSend = false, IsTemp = false, BouncingEmail = false, PartyName = "", FirmName = "", Address1 = "", Address2 = "", Address3 = "", Address4 = "", FellYR = "", SuspendReason = "", History3 = "", TeamViewerID = "", MRN = "", AF = "", CP = "", AssoYR = "", Phone3 = "", Fax1 = "", Fax2 = "", BlackListedProduct = "", History1 = "", History2 = "", Mobile1 = "", Mobile2 = "", Mobile3 = "", Mobile4 = "", Phone1 = "", Phone2 = "", PhoneNo = "", FaxNo = "", Email1 = "", Email2 = "", VisitingHours = "", CustomerPassword = "", ShortName = "", CustomerID = "", SingleMulti = "", IsProspective = false, TeamViewerID1 = "", TeamViewerID2 = "", EmailStatus = null, IsSelect = false, KYC = false, temp2 = null, KS_CoverDate = null, KS_DocDate = null, KS_SendDate = null, KS_IsSend = false, KS_IsCover = false, KS_IsDoc = false, KS_DocNo = "", KS_DocMode = "", xIsCall = null, xIsOver = null, xUserID = null, xCallDate = null, xRemark2 = "", xRemark3 = "", xRemark4 = "", xRemark5 = "", xRemark1 = "", ReEmail = false, BlockMode = false, GSTNo = "", ReferencePartyID = null, LeadGenerationID = null, Cguid = "", StateID = null,
    flag = "A"
  } = req.body;

  const sequelize = await dbConection();

  try {
    let query = "";

    if (flag === "U") {
      query += `
        DELETE FROM Party WHERE CustomerID = :CustomerID AND Cguid = :Cguid;
      `;
    }

    query += `
      INSERT INTO Party
      (CityID, xCityID, PinCodeID, xPinCodeID, PinCode, ParentID, Balance, EmailStatusID, xPinCode, AreaID, xAreaID, DealerID, DesignationID, GroupUkeyId, DOB, DOJ, OldDOJ, DOA, EmailDate, IsActive, BlackListed, IsTeamViewer, IsPrint, IsSuspend, IsCDSend, IsTemp, BouncingEmail, PartyName, FirmName, Address1, Address2, Address3, Address4, FellYR, SuspendReason, History3, TeamViewerID, MRN, AF, CP, AssoYR, Phone3, Fax1, Fax2, BlackListedProduct, History1, History2, Mobile1, Mobile2, Mobile3, Mobile4, Phone1, Phone2, PhoneNo, FaxNo, Email1, Email2, VisitingHours, CustomerPassword, ShortName, CustomerID, SingleMulti, IsProspective, TeamViewerID1, TeamViewerID2, EmailStatus, IsSelect, KYC, temp2, KS_CoverDate, KS_DocDate, KS_SendDate, KS_IsSend, KS_IsCover, KS_IsDoc, KS_DocNo, KS_DocMode, xIsCall, xIsOver, xUserID, xCallDate, xRemark2, xRemark3, xRemark4, xRemark5, xRemark1, ReEmail, BlockMode, GSTNo, ReferencePartyID, LeadGenerationID, Cguid, StateID)
      VALUES
      (:CityID, :xCityID, :PinCodeID, :xPinCodeID, :PinCode, :ParentID, :Balance, :EmailStatusID, :xPinCode, :AreaID, :xAreaID, :DealerID, :DesignationID, :GroupUkeyId, :DOB, :DOJ, :OldDOJ, :DOA, :EmailDate, :IsActive, :BlackListed, :IsTeamViewer, :IsPrint, :IsSuspend, :IsCDSend, :IsTemp, :BouncingEmail, :PartyName, :FirmName, :Address1, :Address2, :Address3, :Address4, :FellYR, :SuspendReason, :History3, :TeamViewerID, :MRN, :AF, :CP, :AssoYR, :Phone3, :Fax1, :Fax2, :BlackListedProduct, :History1, :History2, :Mobile1, :Mobile2, :Mobile3, :Mobile4, :Phone1, :Phone2, :PhoneNo, :FaxNo, :Email1, :Email2, :VisitingHours, :CustomerPassword, :ShortName, :CustomerID, :SingleMulti, :IsProspective, :TeamViewerID1, :TeamViewerID2, :EmailStatus, :IsSelect, :KYC, :temp2, :KS_CoverDate, :KS_DocDate, :KS_SendDate, :KS_IsSend, :KS_IsCover, :KS_IsDoc, :KS_DocNo, :KS_DocMode, :xIsCall, :xIsOver, :xUserID, :xCallDate, :xRemark2, :xRemark3, :xRemark4, :xRemark5, :xRemark1, :ReEmail, :BlockMode, :GSTNo, :ReferencePartyID, :LeadGenerationID, :Cguid, :StateID);
    `;

    await sequelize.query(query, {
      replacements: {
        CityID, xCityID, PinCodeID, xPinCodeID, PinCode, ParentID, Balance, EmailStatusID, xPinCode, AreaID, xAreaID, DealerID, DesignationID, GroupUkeyId, DOB, DOJ, OldDOJ, DOA, EmailDate, IsActive, BlackListed, IsTeamViewer, IsPrint, IsSuspend, IsCDSend, IsTemp, BouncingEmail, PartyName, FirmName, Address1, Address2, Address3, Address4, FellYR, SuspendReason, History3, TeamViewerID, MRN, AF, CP, AssoYR, Phone3, Fax1, Fax2, BlackListedProduct, History1, History2, Mobile1, Mobile2, Mobile3, Mobile4, Phone1, Phone2, PhoneNo, FaxNo, Email1, Email2, VisitingHours, CustomerPassword, ShortName, CustomerID, SingleMulti, IsProspective, TeamViewerID1, TeamViewerID2, EmailStatus, IsSelect, KYC, temp2, KS_CoverDate, KS_DocDate, KS_SendDate, KS_IsSend, KS_IsCover, KS_IsDoc, KS_DocNo, KS_DocMode, xIsCall, xIsOver, xUserID, xCallDate, xRemark2, xRemark3, xRemark4, xRemark5, xRemark1, ReEmail, BlockMode, GSTNo, ReferencePartyID, LeadGenerationID, Cguid, StateID
      },
    });

    res.status(200).json({
      message:
        flag === "A" ? "Party record created successfully" : "Party record updated successfully", Success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

// Get Party (with optional filters)
export const getParty = async (req, res) => {
  const { CustomerID, Cguid, DealerCguid, Mobile1, Email1, Page, PageSize, StateID } = req.query;
  const sequelize = await dbConection();

  try {
    let query = `SELECT * FROM Party WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM Party WHERE 1=1`;
    const replacements = {};

    if (CustomerID) {
      query += " AND CustomerID = :CustomerID";
      countQuery += " AND CustomerID = :CustomerID";
      replacements.CustomerID = CustomerID;
    }
    if (Cguid) {
      query += " AND Cguid = :Cguid";
      countQuery += " AND Cguid = :Cguid";
      replacements.Cguid = Cguid;
    }
    if (StateID) {
      query += " AND StateID = :StateID";
      countQuery += " AND StateID = :StateID";
      replacements.StateID = StateID;
    }
    if (DealerCguid) {
      query += " AND DealerCguid LIKE :DealerCguid";
      countQuery += " AND DealerCguid LIKE :DealerCguid";
      replacements.DealerCguid = DealerCguid;
    }
    if (Mobile1) {
      query += " AND Mobile1 LIKE :Mobile1";
      countQuery += " AND Mobile1 LIKE :Mobile1";
      replacements.Mobile1 = `%${Mobile1}%`;
    }
    if (Email1) {
      query += " AND Email1 LIKE :Email1";
      countQuery += " AND Email1 LIKE :Email1";
      replacements.Email1 = `%${Email1}%`;
    }

    // Order by PartyID DESC (assuming PartyID is the primary key/auto-increment)
    query += " ORDER BY PartyID DESC";

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

export const cityWisePartyCount = async (req, res) => {
  const sequelize = await dbConection();
  try{
    const [results] = await sequelize.query(`select * from cityWisePartyCount`);

    res.status(200).json({ data: results, Success: true });

  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Database error", Success: false });
  }finally{
    await sequelize.close();
  }
}

// Delete Party
export const deleteParty = async (req, res) => {
  const { CustomerID, Cguid } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM Party WHERE CustomerID = :CustomerID AND Cguid = :Cguid";
    const result = await sequelize.query(query, { replacements: { CustomerID, Cguid } });

    if (result[1] === 0) {
      return res.status(404).json({ error: "Party record not found" });
    }

    res.status(200).json({ message: "Party record deleted successfully", Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};
