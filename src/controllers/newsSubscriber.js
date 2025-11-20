import { dbConection } from "../config/db.js";
import { sendBulkEmails } from '../services/email.js';

export const addUpdateNewsLetter = async (req , res)=> {
    const {email} = req.body;
    const sequelize = await dbConection();
    try{

        const checkEmailExist = await sequelize.query(`select 1 from newsLetter where email = :email`, {
            replacements: {
                email
            }
        })
        
        if(checkEmailExist[1]){
            return res.status(400).json({Success : false, error : 'you already subscribed for news letter.'})
        }

        const result = await sequelize.query(`
            insert into newsLetter (
                email
            ) values (
                :email 
            )`, {
            replacements: {
                email
            },
        });

        if(!result[1]){
            return res.status(400).json({Success : false, message : 'internal server error.'})
        }

        const emailHTMLContent = `
            <div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
            <div style="max-width:600px; margin:0 auto; background:#ffffff; padding:25px; border-radius:8px;">

                <h2 style="color:#333; text-align:center;">Thank You for Subscribing!</h2>

                <p>Hello,</p>

                <p>
                Thank you for subscribing! We’re excited to have you with us.
                From now on, you’ll receive regular updates, important announcements, 
                and exclusive insights directly in your inbox. Stay connected — great things are coming your way!
                </p>

                <h3 style="color:#444;">Activate WhatsApp Updates (Important)</h3>

                <p>To receive <strong>Taxfile Monarch News</strong> and regular taxation updates personally on WhatsApp, please follow these steps:</p>

                <ol style="padding-left:20px;">
                <li>Save the number <strong>9825558880</strong> in your phone as <strong>TAXFILE MONARCH NEWS</strong>.</li>
                <li>After saving the number, send a WhatsApp message to <strong>monarchtax</strong> with the following details <strong>in one line</strong>:</li>
                </ol>

                <p style="padding: 10px; background:#f1f1f1; border-left:4px solid #007bff;">
                Monarch User ID, Your Name, Role (Owner / Partner / Office Assistant), City
                </p>

                <p style="color:#d9534f; font-weight:bold;">
                ⚠️ Please avoid calling on 9825558880. WhatsApp messages only.
                </p>

                <br>

                <p>Warm regards,<br>
                <strong>TAXFILE INVOSOFT PVT. LTD..</strong> Team<br>
                <a href="https://taxfile.co.in/" target="_blank">https://taxfile.co.in/</a>
                </p>

            </div>
            </div>
            `;


        sendBulkEmails(
            [{ email }], 'Thank You for Subscribing - Stay Connected With Taxfile Monarch Updates', emailHTMLContent
        );

        res.status(200).json({ message: "created successfully", Success : true});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: err.message, Success : false });
    }finally{
        await sequelize.close();
    }
}

export const getNewsLetterSubscriber = async (req , res)=> {
    const {Page, PageSize} = req.query
    const sequelize = await dbConection()
    try{
        let query = " SELECT * FROM newsLetter WHERE 1=1";
        let countQuery = "SELECT COUNT(*) as totalCount FROM newsLetter WHERE 1=1";
        const replacements = {};

        // Apply pagination if provided
        const pageNum = parseInt(Page, 10);
        const pageSizeNum = parseInt(PageSize, 10);

        const [CountResult] = await sequelize.query(countQuery, { replacements });

        if (!isNaN(pageNum) && !isNaN(pageSizeNum) && pageNum > 0 && pageSizeNum > 0) {
        const offset = (pageNum - 1) * pageSizeNum;
        query += "ORDER BY Id OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY";
        replacements.offset = offset;
        replacements.pageSize = pageSizeNum;
        }

        const [results] = await sequelize.query(query, { replacements });
        res.status(200).json({data : results, totalCount: CountResult[0].totalCount});
    }catch(error){
        console.error(error);
        res.status(500).json({ error: error.message, Success : false });
    }finally{
        await sequelize.close();
    }
}