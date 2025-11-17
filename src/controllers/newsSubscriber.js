import { dbConection } from "../config/db.js";

export const addUpdateNewsLetter = async (req , res)=> {
    const {email} = req.body;
    const sequelize = await dbConection();
    try{

        const checkEmailExist = await sequelize.query(`select 1 from newsLetter where email = :email`, {
            replacements: {
                email
            }
        })
        console.log(checkEmailExist);
        
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