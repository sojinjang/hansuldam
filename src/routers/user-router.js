import { Router } from "express";
import { isEmptyObject, loginRequired, adminRequired } from "../middlewares";
import { userService } from "../services";
import { generateRandomPassword, sendRandomPassword } from "../utils";
import { BadRequest } from "../utils/errorCodes";

import bcrypt from "bcrypt";

const userRouter = Router();
const authRouter = Router();
const adminRouter = Router();

userRouter.use("/auth", loginRequired, authRouter);
userRouter.use("/admin", loginRequired, adminRequired, adminRouter);

//-----관리자
// 전체 유저 목록을 가져옴 (배열 형태임)
adminRouter.get("/", async (req, res, next) => {
  try {
    // 전체 사용자 목록을 얻음
    const users = await userService.getUsers();

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

//----- 회원
// 사용자 정보 조회
authRouter.get("/", async (req, res, next) => {
  try {
    const userId = req.currentUser.userId;

    const getUserInfo = await userService.getUserOne(userId);

    res.status(200).json(getUserInfo);
  } catch (error) {
    next(error);
  }
});

// 사용자 정보 수정
authRouter.patch("/", isEmptyObject, async (req, res, next) => {
  try {
    const userId = req.currentUser.userId;

    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const email = req.body.email;
    const fullName = req.body.fullName;
    const password = req.body.newPassword;
    const phoneNumber = req.body.phoneNumber;
    const address = req.body.address;
    const currentPassword = req.body.password;

    let userInfoRequired;
    // 만약 새로운 비밀번호를 입력했다면
    if (password) {
      // body data로부터, 확인용으로 사용할 현재 비밀번호를 추출함.
      // currentPassword 없을 시, 진행 불가
      if (!currentPassword) {
        throw new BadRequest("Need currentPassword", 4105);
      }
      userInfoRequired = { userId, currentPassword };
    }

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(email && { email }),
      ...(fullName && { fullName }),
      ...(password && { password }),
      ...(address && { address }),
      ...(phoneNumber && { phoneNumber }),
    };

    let updatedUserInfo;
    // 사용자 정보를 업데이트함.
    if (userInfoRequired) {
      updatedUserInfo = await userService.setUser(userInfoRequired, toUpdate);
    } else {
      updatedUserInfo = await userService.NoPasswordSetUser(userId, toUpdate);
    }

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json(updatedUserInfo);
  } catch (error) {
    next(error);
  }
});

// 사용자 삭제(탈퇴)
authRouter.delete("/", async (req, res, next) => {
  try {
    const userId = req.currentUser.userId;

    const deleteUser = await userService.deleteUserOne(userId);

    res.status(200).json(deleteUser);
  } catch (error) {
    next(error);
  }
});

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
    if (!needCheckEmail) {
      throw new BadRequest("Undefined params", 4005);
    }
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
