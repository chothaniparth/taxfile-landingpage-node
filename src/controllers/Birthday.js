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
