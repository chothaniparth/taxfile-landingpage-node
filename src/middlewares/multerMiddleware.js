import multer  from "multer";

const documentUploadStorageV1 = multer.diskStorage({
    destination: async function (req, file, cb) {        
        cb(null, `./media/Docs/`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

export const DocUploadV1 = multer({ storage: documentUploadStorageV1 }).fields([
    { name: 'FileName', maxCount: 100 },
]);