import { dbConection } from "../config/db.js";
import dotenv from 'dotenv';
dotenv.config();

export const getPastProduct = async (req, res) => {
  const {  PartyId , ExpiryYear } = req.query;
  const sequelize = await dbConection(process.env.ITAX_MASTER_DB_NAME, process.env.ITAX_DB_USER, process.env.ITAX_DB_PASSWORD, process.env.ITAX_DB_SERVER);

  try {

    const [uearResults] = await sequelize.query(`
        SELECT DATEPART(YEAR,DATEADD(YY,1,iddate)) ExpiryYear FROM Trans WHERE PartyId=:PartyId GROUP BY DATEPART(YEAR,DATEADD(YY,1,iddate)) ORDER BY DATEPART(YEAR,DATEADD(YY,1,iddate)) DESC    
    `, {
      replacements: {
        PartyId
      },
    });

    const [selectPartyResults] = await sequelize.query(`
        select PartyID,Trans.IdDate GenerateDate,ProductName, case when NoOfUsers>1 then 'Multi' else 'Single' end 
        Users ,ProductKey,UnlockKey,YearKey,ExDate,Remarks,TransId
        from Trans with (nolock) inner join (Select ProductId From Trans where 
        PartyId=:PartyId and datepart(year,exdate)=:ExpiryYear
        Group by ProductId) as m on m.ProductId=Trans.ProductId left join Product on Product.ProductId=Trans.ProductId
        Where PartyId=:PartyId AND datepart(year,exdate)=:ExpiryYear
    `, {
      replacements: {
        PartyId, ExpiryYear
      },
    });    
    
    res.status(200).json({ data: uearResults, selectParty: selectPartyResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await sequelize.close();
  }
};
