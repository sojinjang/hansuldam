import multer from "multer";
import path from "path";
import { BadRequest } from "./error-codes";

const Location = {
  PRODUCT: "products",
  COMMENT: "comments",
};

const upload = multer({
  fileFilter: function (req, file, done) {
    // location 쿼리 체크
    const flag = Object.values(Location).includes(req.query.location);
    if (!flag) {
      done(null, false);
      throw new BadRequest("location query error", 4601);
    }
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
      // 요청에 따라 경로 다르게 저장
      const location = req.query.location;
      cb(null, path.join("src", "views", "img", location));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
});

export { upload };
