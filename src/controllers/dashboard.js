import { dbConection } from "../config/db.js";

export const dashboardList = async (req, res) => {
    const sequelize = await dbConection();

    try {

        const { fromDate, toDate } = req.query;

        const NumberOfProductOncategory = await sequelize.query(`
            select cm.CategoryName, COUNT(pm.CategoryId) AS TotalProduct from CategoryMast cm
            left join ProductMast pm on pm.CategoryId = cm.CategoryId
            group by cm.CategoryName    
        `);
        const TotalDealer = await sequelize.query(`
            select COUNT(DealerID) AS totalDealer from Dealer where IsActive = 1
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
        const TotalDealerIncomeWithDate = await sequelize.query(`SELECT dl.DealerCguid, dl.DealerName,
            SUM(pl.Amount) AS TotalAmount, SUM(pl.GSTonPayout) AS TotalGST, 
            SUM(pl.Amount + pl.GSTonPayout) AS TotalAmountWithGST, COUNT(pl.DealerCguid) AS DealerEntry
            FROM PayoutLine pl LEFT JOIN Dealer dl
            ON pl.DealerCguid = dl.DealerCguid
            ${fromDate && toDate ?
                `            
                    WHERE pl.PaidDate >= :fromDate
                    AND pl.PaidDate <= DATEADD(DAY, 1, :toDate)
                ` : ''
            }
            GROUP BY dl.DealerCguid, dl.DealerName
            ORDER BY TotalAmount DESC`, {
            replacements: {
                fromDate, toDate
            },
        })
        const chartSalesData = await sequelize.query(`
            SELECT tm.DealerCguid, dl.DealerName,
            SUM(tm.AmountExGST) AS TotalAmount, SUM(tm.GSTAmount) AS TotalGST,
            SUM(tm.AmountExGST + tm.GSTAmount) AS TotalAmountWithGST, COUNT(tm.DealerCguid) AS DealerEntry
            FROM TransactionMast tm LEFT JOIN Dealer dl
            ON tm.DealerCguid = dl.DealerCguid
            ${fromDate && toDate ?
                `
                    WHERE tm.InvoiceDate >= :fromDate
                    AND tm.InvoiceDate <= :toDate
                ` : ''
            }
            GROUP BY tm.DealerCguid, dl.DealerName
            ORDER BY TotalAmount DESC
            `, {
            replacements: {
                fromDate, toDate
            },
        })
        const ProductIncomeData = await sequelize.query(`
            select pm.ProductName, SUM(tp.AmountExGST) totalAmountExGST, SUM(tp.GrossAmount) totalGrossAmount, SUM(tp.GSTAmount) totalGSTAmount from TransactionProduct tp
            left join ProductMast pm on tp.ProductCguid = pm.ProductUkeyId
            left join TransactionMast tm on tm.TransactionUkeyId = tp.TransactionUkeyId
            ${fromDate && toDate ?
                `
                    WHERE tm.InvoiceDate >= :fromDate
                    AND tm.InvoiceDate <= :toDate
                ` : ''
            }
            group by pm.ProductName
            order by totalAmountExGST desc
            `, {
            replacements: {
                fromDate, toDate
            },
        })
        const monthlyIncomeData = await sequelize.query(`
            SELECT SUM(tm.AmountExGST) AS TotalAmount, SUM(tm.GSTAmount) AS TotalGST,
            SUM(tm.AmountExGST + tm.GSTAmount) AS TotalAmountWithGST, YEAR(InvoiceDate) AS
            Year, MONTH(InvoiceDate) AS Month
            FROM TransactionMast tm LEFT JOIN Dealer dl
            ON tm.DealerCguid = dl.DealerCguid
            ${fromDate && toDate ?
                `
                    WHERE tm.InvoiceDate >= :fromDate
                    AND tm.InvoiceDate <= :toDate
                ` : ''
            }
            GROUP BY YEAR(InvoiceDate), MONTH(InvoiceDate)
            `, {
            replacements: {
                fromDate, toDate
            },
        })

        res.status(200).json({
            NumberOfProductOncategory: NumberOfProductOncategory[0],
            TotalDealer: TotalDealer?.[0]?.[0]?.totalDealer,
            DealerIncom: DealerIncom[0],
            numberOfPartyOnEveryDealer: numberOfPartyOnEveryDealer[0],
            totalVacencyApply: numberOfTotalVacencyApply?.[0]?.[0]?.totalVacencyApply,
            TotalInqueryOfEachMode: TotalInqueryOfEachMode[0],
            TotalInqueryOfEachProduct: TotalInqueryOfEachProduct[0],
            TotalDealerIncomeWithDate: TotalDealerIncomeWithDate[0],
            chartSalesData: chartSalesData[0],
            ProductIncomeData: ProductIncomeData[0],
            monthlyIncomeData: monthlyIncomeData[0],
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error", Success: false });
    } finally {
        await sequelize.close();
    }
}

