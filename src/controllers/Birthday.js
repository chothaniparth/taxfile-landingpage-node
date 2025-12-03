import { dbConection } from "../config/db.js";
import dotenv from 'dotenv';
dotenv.config();

export const getBirthdayList = async (req, res) => {
  const sequelize = await dbConection();

  try {

    const [todayB] = await sequelize.query(`
        SELECT *,CONVERT(VARCHAR(MAX),Birthday,111) FBirthday FROM 
        tblBirthdayAnniversary tB LEFT OUTER JOIN tblrelation tR ON tB.RelationID = tR.RID 
        WHERE (FORMAT(Birthday,'MMdd')=FORMAT((SWITCHOFFSET(SYSDATETIMEOFFSET(),'+05:30')),'MMdd')) AND IsActive=1 
    `);

    const [todayA] = await sequelize.query(`
        SELECT *,ISNULL((SELECT ISNULL(Name,'') FROM tblbirthdayanniversary WHERE RelationID = 0 AND 
        PartyID = tB.PartyID)+'__'+tR.RelationName + ' ' ,'') + ISNULL(tB.Name,'') FName,CONVERT(VARCHAR(MAX),
        Anniversary,111) FAnniversary FROM tblBirthdayAnniversary tB LEFT OUTER JOIN 
        tblrelation tR ON tB.RelationID = tR.RID WHERE 
        (FORMAT(Anniversary,'MMdd')=FORMAT((SWITCHOFFSET(SYSDATETIMEOFFSET(),'+05:30')),'MMdd')) AND IsActive=1
    `);

    const [lastweekB] = await sequelize.query(`
        SELECT DATEDIFF(YEAR, Birthday, GETDATE()) Age,DATEDIFF(DAY,DATEADD(YEAR,DATEDIFF(YEAR, Birthday, GETDATE()), 
        Birthday),getdate()) DaysAgo,*,ISNULL((SELECT Top 1  ISNULL(Name,'') FROM tblbirthdayanniversary WHERE
        RelationID = 0 AND PartyID = tB.PartyID)+'__'+tR.RelationName + ' ' ,'') + ISNULL(tB.Name,'') FName,
        CONVERT(VARCHAR(MAX),Birthday,111) FBirthDay FROM tblBirthdayAnniversary tB LEFT OUTER JOIN 
        tblrelation tR ON tB.RelationID = tR.RID WHERE 
        ((FORMAT(Birthday,'MMdd')<FORMAT((SWITCHOFFSET(SYSDATETIMEOFFSET(),'+05:30')),'MMdd')) AND 
        (FORMAT(Birthday,'MMdd')>=FORMAT(DATEADD(DAY,-7,(SWITCHOFFSET(SYSDATETIMEOFFSET(),'+05:30'))),'MMdd'))) 
        AND IsActive=1  ORDER BY DaysAgo DESC
    `);

    const [lastweekA] = await sequelize.query(`
        SELECT DATEDIFF(YEAR, Anniversary, GETDATE()) Age,DATEDIFF(DAY,DATEADD(YEAR,DATEDIFF(YEAR, Anniversary, 
        GETDATE()), Anniversary),getdate()) DaysAgo,*,ISNULL((SELECT Top 1  ISNULL(Name,'') FROM tblbirthdayanniversary 
        WHERE RelationID = 0 AND PartyID = tB.PartyID)+'__'+tR.RelationName + ' ' ,'') + ISNULL(tB.Name,'') FName,
        CONVERT(VARCHAR(MAX),Anniversary,111) FAnniversary FROM tblBirthdayAnniversary tB LEFT OUTER JOIN 
        tblrelation tR ON tB.RelationID = tR.RID WHERE 
        ((FORMAT(Anniversary,'MMdd')<FORMAT((SWITCHOFFSET(SYSDATETIMEOFFSET(),'+05:30')),'MMdd')) AND
        (FORMAT(Anniversary,'MMdd')>=FORMAT(DATEADD(DAY,-7,(SWITCHOFFSET(SYSDATETIMEOFFSET(),'+05:30'))),'MMdd'))) 
        AND IsActive=1  ORDER BY DaysAgo DESC
    `);

    const [upcomingBirthday] = await sequelize.query(`
        SELECT DATEDIFF(YEAR, Birthday, GETDATE()) Age,DATEDIFF(DAY,(SWITCHOFFSET(SYSDATETIMEOFFSET(),'+05:30')),
        CASE WHEN DATEADD(YEAR,DATEDIFF(YEAR, birthday, (SWITCHOFFSET(SYSDATETIMEOFFSET(),'+05:30'))), birthday)<(SWITCHOFFSET(SYSDATETIMEOFFSET(),'+05:30'))
        THEN DATEADD(YEAR,1,DATEADD(YEAR,DATEDIFF(YEAR, birthday, (SWITCHOFFSET(SYSDATETIMEOFFSET(),'+05:30'))), birthday))
        ELSE DATEADD(YEAR,DATEDIFF(YEAR, birthday, (SWITCHOFFSET(SYSDATETIMEOFFSET(),'+05:30'))), birthday)END) DaysRemain,*,
        ISNULL((SELECT Top 1  ISNULL(Name,'') FROM tblbirthdayanniversary WHERE RelationID = 0 
        AND PartyID = tB.PartyID)+'__'+tR.RelationName + ' ' ,'') + ISNULL(tB.Name,'') FName,CONVERT(VARCHAR(MAX),Birthday,111) FBirthday FROM tblBirthdayAnniversary tB
        LEFT OUTER JOIN tblrelation tR ON tB.RelationID = tR.RID WHERE
        FORMAT(Birthday,'MMdd')!=FORMAT((SWITCHOFFSET(SYSDATETIMEOFFSET(),'+05:30')),'MMdd') ORDER BY DaysRemain
    `);

    const [upcomingAnniversary] = await sequelize.query(`
        SELECT DATEDIFF(YEAR, Anniversary, GETDATE()) Age,DATEDIFF(DAY,(SWITCHOFFSET(SYSDATETIMEOFFSET(),'+05:30')),
        CASE WHEN DATEADD(YEAR,DATEDIFF(YEAR, Anniversary, (SWITCHOFFSET(SYSDATETIMEOFFSET(),'+05:30'))),
        Anniversary)<(SWITCHOFFSET(SYSDATETIMEOFFSET(),'+05:30')) THEN DATEADD(YEAR,1,DATEADD(YEAR,DATEDIFF(YEAR,
        Anniversary, (SWITCHOFFSET(SYSDATETIMEOFFSET(),'+05:30'))), Anniversary)) ELSE DATEADD(YEAR,DATEDIFF(YEAR, 
        Anniversary, (SWITCHOFFSET(SYSDATETIMEOFFSET(),'+05:30'))), Anniversary)END) DaysRemain,*,
        ISNULL((SELECT Top 1  ISNULL(Name,'') FROM tblbirthdayanniversary WHERE RelationID = 0 AND
        PartyID = tB.PartyID)+'__'+tR.RelationName + ' ' ,'') + ISNULL(tB.Name,'') FName,CONVERT(VARCHAR(MAX),
        Anniversary,111) FAnniversary FROM tblBirthdayAnniversary tB LEFT OUTER JOIN tblrelation tR ON 
        tB.RelationID = tR.RID WHERE FORMAT(Anniversary,'MMdd')!=FORMAT((SWITCHOFFSET(SYSDATETIMEOFFSET(),'+05:30')),'MMdd') ORDER BY DaysRemain
    `);

    res.status(200).json({ todayB, todayA, lastweekB, lastweekA, upcomingBirthday, upcomingAnniversary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};

export const getBirthdayandAnniversarylist = async (req, res) => {
  const { id, Name, Mobile, Email, PartyId, IsActive, Page, PageSize } = req.query
  const sequelize = await dbConection()
  try {
    let query = `SELECT * FROM tblBirthdayAnniversary WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) AS totalcount FROM tblBirthdayAnniversary WHERE 1=1`;
    const replacements = {};

    if (id) {
      query += `AND id = :id`;
      countQuery += `AND id = :id`;
      replacements.id = id
    }

    if (Name) {
      query += ` AND Name LIKE :Name`;
      countQuery += ` AND Name LIKE :Name`;
      replacements.Name = `%${Name}%`;
    }

    if (Mobile) {
      query += ` AND Mobile LIKE :Mobile`;
      countQuery += ` AND Mobile LIKE :Mobile`;
      replacements.Mobile = `%${Mobile}%`;
    }

    if (Email) {
      query += ` AND Email LIKE :Email`;
      countQuery += ` AND Email LIKE :Email`;
      replacements.Email = `%${Email}%`;
    }

    if (PartyId) {
      query += ` AND PartyId = :PartyId`;
      countQuery += ` AND PartyId = :PartyId`;
      replacements.PartyId = PartyId
    }

    if (IsActive !== undefined) {
      query += ` AND IsActive = :IsActive`;
      countQuery += ` AND IsActive = :IsActive`;
      replacements.IsActive = IsActive;
    }

    query += ` ORDER BY id ASC`;

    const [countResult] = await sequelize.query(countQuery, { replacements });
    const totalCount = countResult[0]?.totalcount || 0;

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

  } catch (error) {
    res.status(500).json({ error: "Database error", Success: false });
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

export const createBirthday = async (req, res) => {
  const { id, Name, RelationId, Mobile, Email, Birthday, Anniversary, PartyId, IsActive = true, RegionID, Degree, Flag = "A" } = req.body
  const sequelize = await dbConection()

  try {

    if (Flag === "U") {

      if (!id) {
        return res.status(400).json({ message: "ID is required for update", Success: false });
      }

      const result = await sequelize.query(`
      UPDATE tblBirthdayAnniversary set 
      Name = :Name, 
      RelationId = :RelationId,
      Mobile = :Mobile,
      Email = :Email,
      Birthday = :Birthday,
      Anniversary = :Anniversary,
      PartyId = :PartyId,
      IsActive = :IsActive,
      RegionID = :RegionID,
      Degree = :Degree,
      Flag = :Flag 
      where id = :id`,
        {
          replacements: {
            id, Name, RelationId, Mobile, Email, Birthday, Anniversary, PartyId, IsActive, RegionID, Degree, Flag
          },
        });

      // console.log("result => ", result);

      return res.status(200).json({
        message: "Birthday And Anniversary record updated successfully",
        Success: true
      });
    }

    await sequelize.query(`
      INSERT INTO tblBirthdayAnniversary
      (Name, RelationId, Mobile, Email, Birthday, Anniversary, PartyId, IsActive, RegionID, Degree, Flag )
      VALUES
      (:Name, :RelationId, :Mobile, :Email, :Birthday, :Anniversary, :PartyId, :IsActive, :RegionID, :Degree, :Flag)`, {
      replacements: {
        Name, RelationId, Mobile, Email, Birthday, Anniversary, PartyId, IsActive, RegionID, Degree, Flag
      },
    }
    );

    res.status(200).json({
      message: "Birthday And Anniversary record created successfully",
      Success: true
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
}

export const deleteBirthday = async (req, res) => {
  const { id } = req.params;
  const sequelize = await dbConection();

  try {
    const query = "DELETE FROM tblBirthdayAnniversary WHERE id = :id";
    const result = await sequelize.query(query, { replacements: { id } });

    if (result[1] === 0) {
      return res.status(404).json({ error: "Birthday record not found" });
    }

    res.status(200).json({ message: "Birthday And Anniversary record deleted successfully", Success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
}
