import multer from "multer";

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "src/image/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

export { upload };
