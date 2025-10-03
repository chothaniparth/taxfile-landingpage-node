import multer  from "multer";
import fs from 'fs';

const documentUploadStorageV1 = multer.diskStorage({
    destination: async function (req, file, cb) {
        console.log("body : " ,req.body);
        
        await fs.mkdirSync(`./media/${req?.body?.Master}`, { recursive: true });
        cb(null, `./media/${req?.body?.Master}/`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

export const DocUploadV1 = multer({ storage: documentUploadStorageV1 }).fields([
    { name: 'FileName', maxCount: 100 },
]);