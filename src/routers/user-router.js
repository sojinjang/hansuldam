import { Router } from "express";
import { isEmptyObject } from "../middlewares";
import { userService } from "../services";
import { generateRandomPassword } from "../utils/generate-random-password";
import { sendRandomPassword } from "../utils/send-mail";
import bcrypt from "bcrypt";

const userRouter = Router();

// 로그인 api
userRouter.post("/login", isEmptyObject, async (req, res, next) => {
  try {
    // req (request) 에서 데이터 가져오기
    const email = req.body.email;
    const password = req.body.password;

    // 로그인 진행 (로그인 성공 시 jwt 토큰을 프론트에 보내 줌)
    const userToken = await userService.getUserToken({ email, password });

    // jwt 토큰을 프론트에 보냄 (jwt 토큰은, 문자열임)
    res.status(200).json(userToken);
  } catch (error) {
    next(error);
  }
});

// 회원가입 api (아래는 /register이지만, 실제로는 /api/user/register로 요청해야 함.)
userRouter.post("/register", isEmptyObject, async (req, res, next) => {
  try {
    const fullName = req.body.fullName;
    const email = req.body.email;
    const password = req.body.password;
    const phoneNumber = req.body.phoneNumber;
    const address = req.body.address;

    // 위 데이터를 유저 db에 추가하기
    const newUser = await userService.addUser({
      fullName,
      email,
      password,
      phoneNumber,
      address,
    });

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// 이메일 체크
userRouter.get("/emailCheck/:email", async (req, res, next) => {
  try {
    const needCheckEmail = req.params.email;

    // 위 데이터를 유저 db에 추가하기
    const answer = await userService.emailCheck(needCheckEmail);

    res.status(201).json(answer);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/random-password", isEmptyObject, async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userService.findUserByEmail(email);

    const newPassword = generateRandomPassword();
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    const randomPasswordUpdate = await userService.changePasswordAsRandom(
      user._id,
      newHashedPassword
    );

    await sendRandomPassword(
      email,
      "임시 비밀번호 발급 이메일입니다.",
      `임시 비밀번호: ${newPassword}
  로그인 후 새로운 비밀번호로 변경해주세요.`
    );

    res.status(200).json(randomPasswordUpdate);
  } catch (error) {
    next(error);
  }
});

export { userRouter };
