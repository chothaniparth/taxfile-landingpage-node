import multer from "multer";
import fs from "fs";

const documentUploadStorageV1 = multer.diskStorage({
    destination: async function (req, file, cb) {
        await fs.mkdirSync(`./media/${req.params?.Master}`, { recursive: true });
        cb(null, `./media/${req.params?.Master}/`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

export const DocUploadV1 = multer({
    storage: documentUploadStorageV1,
    limits: { fileSize: 1 * 1024 * 1024 * 1024 }  // 1GB
}).fields([
    { name: 'FileName', maxCount: 100 }
]);