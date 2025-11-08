import fs from 'fs';
import path from 'path';

export const textContentUpdate = (req, res) => {
    try{
        const {message = '', type = ''} = req.body;

        if(type === 'PRIVICY_POLICY') {
            fs.writeFileSync('./PRIVICY_POLICY.txt', message, 'utf8');
        } else if (type === 'T_C'){
            fs.writeFileSync('./T_C.txt', message, 'utf8');
        } else if (type === 'TAX_NOTICE'){
            fs.writeFileSync('./TAX_NOTICE.txt', message, 'utf8');
        }

        res.status(200).json({ message: 'Text content updated successfully', Success: true });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: error.message, Success: false });
    }
}

export const getTextContent = async (req, res) => {
    try{
        const {type = ''} = req.params;
        let content = '';
        if(type === 'PRIVICY_POLICY') {
            content = fs.readFileSync('./PRIVICY_POLICY.txt', 'utf8');
        }
        else if (type === 'T_C'){
            content = fs.readFileSync('./T_C.txt', 'utf8');
        }
        else if (type === 'TAX_NOTICE'){
            content = fs.readFileSync('./TAX_NOTICE.txt', 'utf8');
        }
        res.status(200).json({ message: 'Text content fetched successfully', content, Success: true });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: error.message, Success: false });
    }
}