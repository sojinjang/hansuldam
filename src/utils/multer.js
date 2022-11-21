import multer from "multer";
import path from "path";

const upload = multer({
  fileFilter: function (req, file, done) {
    if (file.mimetype.lastIndexOf("image") > -1) {
      //파일 허용
      done(null, true);
    } else {
      //파일 거부
      done(null, false);
    }
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join("src", "views", "img", "products"));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
});

export { upload };
