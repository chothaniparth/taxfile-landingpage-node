import { dbConection } from "../config/db.js";

export const dashboardList = async (req, res) =>{
    const sequelize = await dbConection();

    try{
        const NumberOfProductOncategory = await sequelize.query(`
            select cm.CategoryName, COUNT(pm.CategoryId) AS TotalProduct from CategoryMast cm
            left join ProductMast pm on pm.CategoryId = cm.CategoryId
            group by cm.CategoryName    
        `);
        const TotalDealer = await sequelize.query(`
            select COUNT(DealerID) AS totalDealer from Dealer
        `);
        const DealerIncom = await sequelize.query(`
            select SUM(tm.AmountExGST) AS totalAmountExGST, SUM(tm.GrossAmount) AS TotalGrossAmount, SUM(tm.GSTAmount) AS totalGSTAmount, dl.DealerName, tm.DealerCguid from TransactionMast tm
            left join Dealer dl on dl.DealerCguid = tm.DealerCguid
            group by dl.DealerName, tm.DealerCguid
            order by totalAmountExGST desc
        `);
        const numberOfPartyOnEveryDealer = await sequelize.query(`
            select COUNT(pt.DealerCguid) AS totalParty, dl.DealerName from Party pt
            left join Dealer dl on dl.DealerCguid = pt.DealerCguid
            where dl.IsActive = 1
            group by pt.DealerCguid, dl.DealerName
        `);
        const numberOfTotalVacencyApply = await sequelize.query(`
            select COUNT(*) AS totalVacencyApply from VacancyApply
        `);
        const TotalInqueryOfEachMode = await sequelize.query(`
            select COUNT(inquiryMode) AS totalInquery, inquiryMode from InquiryMast
            group by inquiryMode
        `);
        const TotalInqueryOfEachProduct = await sequelize.query(`
            select pm.ProductName, COUNT(im.ProductUkeyId) AS TotalInquery from ProductMast pm 
            left join InquiryMast im on im.ProductUkeyId = pm.ProductUkeyId and im.inquiryMode = 'Product'
            group by pm.ProductName
        `);
        res.status(200).json({
            NumberOfProductOncategory : NumberOfProductOncategory[0],
            TotalDealer : TotalDealer?.[0]?.[0]?.totalDealer,
            DealerIncom : DealerIncom[0],
            numberOfPartyOnEveryDealer : numberOfPartyOnEveryDealer[0],
            totalVacencyApply : numberOfTotalVacencyApply?.[0]?.[0]?.totalVacencyApply,
            TotalInqueryOfEachMode : TotalInqueryOfEachMode[0],
            TotalInqueryOfEachProduct : TotalInqueryOfEachProduct[0]
        });
    }catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error", Success: false });
    } finally {
        await sequelize.close();
    }
}