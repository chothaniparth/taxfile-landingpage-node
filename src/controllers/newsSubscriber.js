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
    const sequelize = await dbConection()
    try{

        const [result] = await sequelize.query(`select * from newsLetter`)  

        res.status(200).json(result)
    }catch(error){
        console.error(err);
        res.status(500).json({ error: err.message, Success : false });
    }finally{
        await sequelize.close();
    }
}