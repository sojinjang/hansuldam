import jwt from "jsonwebtoken";

// 로그인 성공 -> JWT 웹 토큰 생성
const secretKey = process.env.JWT_SECRET_KEY;

// // 2개 프로퍼티를 jwt 토큰에 담음
// const token = jwt.sign({ userId: user._id, role: user.role }, secretKey, {
//   expiresIn: "1h",
// });

exports.setUserToken = (res, user) => {
  const token = jwt.sign(user, secretKey);
  res.cookie("token", token);
};
