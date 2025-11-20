import { dbConection } from "../config/db.js";

// CREATE / UPDATE Complaint
export const createComplaint = async (req, res) => {
  const {
    ComplaintUkeyId = "", PartyCGUID = "", OverBy = "", ContactNo = "", VisitingHours = "", Query = "", flag = "A", UserName = req.user?.UserName || "System", CustomerID = '', ProductUkeyId = '', InqueryCallDate = '', Status = '', CallerName = '', IsOver = false, OverDate = '', OverRemark = ''
  } = req.body;

  const sequelize = await dbConection();

  try {
    const IpAddress =
      req?.headers["x-forwarded-for"] ||
      req?.socket?.remoteAddress ||
      "Not Found";

    let query = "";

    let TicketNo = req.body.TicketNo  || ''

    // If update, delete old record first
    if (flag === "U") {
      query += `
        DELETE FROM ComplaintMast WHERE ComplaintUkeyId = :ComplaintUkeyId;
      `;
    }

    if(flag == 'A'){
       [TicketNo] = await sequelize.query("select ISNULL(MAX(TicketNo),0) + 1 TicketNo from ComplaintMast where CustomerID = :CustomerID", {
        replacements: { CustomerID },
      });
      TicketNo = TicketNo?.[0]?.TicketNo
    }

    // Insert record
    query += `
      INSERT INTO ComplaintMast
      (ComplaintUkeyId, PartyCGUID, OverBy, ContactNo, VisitingHours, Query, flag, IpAddress, EntryDate, UserName, CustomerID, InqueryCallDate, ProductUkeyId, Status, CallerName, TicketNo, IsOver, OverDate, OverRemark)
      VALUES
      (:ComplaintUkeyId, :PartyCGUID, :OverBy, :ContactNo, :VisitingHours, :Query, :flag, :IpAddress, GETDATE(), :UserName, :CustomerID, :InqueryCallDate, :ProductUkeyId, :Status, :CallerName, :TicketNo, :IsOver, :OverDate, :OverRemark);
    `;

    await sequelize.query(query, {
      replacements: {
        ComplaintUkeyId, PartyCGUID, OverBy, ContactNo, VisitingHours, Query, flag, IpAddress, UserName, CustomerID, ProductUkeyId, InqueryCallDate : new Date(InqueryCallDate).toJSON(), Status, CallerName, TicketNo, IsOver, OverDate : new Date(OverDate).toJSON(), OverRemark
      },
    });

    res.status(200).json({
      message:
        flag === "A"
          ? "Complaint created successfully"
          : "Complaint updated successfully",
      Success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

// GET Complaint(s) with optional filters + pagination
export const getComplaint = async (req, res) => {
  const {
    ComplaintUkeyId,
    PartyCGUID,
    OverBy,
    Page,
    PageSize,
    CustomerID,
    InqueryCallDate,
    Status
  } = req.query;

  const sequelize = await dbConection();

  try {
    let query = `select cm.*, pm.ProductName, PartyName from ComplaintMast cm left join ProductMast pm on pm.ProductUkeyId = cm.ProductUkeyId left join Party p on cm.PartyCGUID = p.Cguid  WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM ComplaintMast cm WHERE 1=1`;
    const replacements = {};

    if (ComplaintUkeyId) {
      query += " AND cm.ComplaintUkeyId = :ComplaintUkeyId";
      countQuery += " AND cm.ComplaintUkeyId = :ComplaintUkeyId";
      replacements.ComplaintUkeyId = ComplaintUkeyId;
    }

    if (Status) {
      query += " AND cm.Status = :Status";
      countQuery += " AND cm.Status = :Status";
      replacements.Status = Status;
    }

    if (CustomerID) {
      query += " AND cm.CustomerID = :CustomerID";
      countQuery += " AND cm.CustomerID = :CustomerID";
      replacements.CustomerID = CustomerID;
    }

    if (InqueryCallDate) {
      query += " AND cm.InqueryCallDate = :InqueryCallDate";
      countQuery += " AND cm.InqueryCallDate = :InqueryCallDate";
      replacements.InqueryCallDate = InqueryCallDate;
    }

    if (PartyCGUID) {
      query += " AND cm.PartyCGUID LIKE :PartyCGUID";
      countQuery += " AND cm.PartyCGUID LIKE :PartyCGUID";
      replacements.PartyCGUID = `%${PartyCGUID}%`;
    }

    if (OverBy) {
      query += " AND cm.OverBy LIKE :OverBy";
      countQuery += " AND cm.OverBy LIKE :OverBy";
      replacements.OverBy = `%${OverBy}%`;
    }

    // Always order by EntryDate DESC
    query += " ORDER BY EntryDate DESC";

    // Get total count for pagination
    const [countResult] = await sequelize.query(countQuery, { replacements });
    const totalCount = countResult[0]?.totalCount || 0;

    // Pagination
    const pageNum = parseInt(Page, 10);
    const pageSizeNum = parseInt(PageSize, 10);

    if (!isNaN(pageNum) && !isNaN(pageSizeNum) && pageNum > 0 && pageSizeNum > 0) {
      const offset = (pageNum - 1) * pageSizeNum;
      query += " OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY";
      replacements.offset = offset;
      replacements.pageSize = pageSizeNum;
    }

    const [results] = await sequelize.query(query, { replacements });

    res.status(200).json({
      data: results,
      totalCount,
      Success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error", Success: false });
  } finally {
    await sequelize.close();
  }
};

// DELETE Complaint
export const deleteComplaint = async (req, res) => {
  const { ComplaintUkeyId } = req.params;

  const sequelize = await dbConection();

  try {
    const query = `
      DELETE FROM ComplaintMast WHERE ComplaintUkeyId = :ComplaintUkeyId
    `;

    const result = await sequelize.query(query, {
      replacements: { ComplaintUkeyId },
    });

    if (result[1] === 0) {
      return res
        .status(404)
        .json({ error: "Complaint not found", Success: false });
    }

    res.status(200).json({
      message: "Complaint deleted successfully",
      Success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};
