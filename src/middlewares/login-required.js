import jwt from "jsonwebtoken";
import { NoAuth, IncorrectToken } from "../services/errorCodes";

function loginRequired(req, res, next) {
  // request 헤더로부터 authorization bearer 토큰을 받음.
  const userToken = req.headers["authorization"]?.split(" ")[1];

  // 이 토큰은 jwt 토큰 문자열이거나, 혹은 "null" 문자열이거나, undefined임.
  // 토큰이 "null" 일 경우, login_required 가 필요한 서비스 사용을 제한함.
  if (!userToken || userToken === "null") {
    console.log("서비스 사용 요청이 있습니다.하지만, Authorization 토큰: 없음");
    next(NoAuth);

    return;
  }

  // 해당 token 이 정상적인 token인지 확인
  try {
    const secretKey = process.env.JWT_SECRET_KEY || "ParaisePrison";
    const jwtDecoded = jwt.verify(userToken, secretKey);

    const userId = jwtDecoded.userId; // 식별 id ( _id)
    const userRole = jwtDecoded.role;

    // 라우터에서 req.currentUserId를 통해 유저의 id에 접근 가능하게 됨
    req.currentUser = { userId, userRole };

    next();
  } catch (error) {
    // jwt.verify 함수가 에러를 발생시키는 경우는 토큰이 정상적으로 decode 안되었을 경우임.
    // 403 코드로 JSON 형태로 프론트에 전달함.
    next(IncorrectToken);

    return;
  }
}

export { loginRequired };
