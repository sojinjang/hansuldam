import { Router } from "express";
import is from "@sindresorhus/is";

import { loginRequired } from "../middlewares";
import { userService } from "../services";

const userRouter = Router();

// 로그인 api (아래는 /login 이지만, 실제로는 /api/user/login로 요청해야 함.)
userRouter.post("/login", async (req, res, next) => {
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

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

// 로그아웃
userRouter.post("/logout", loginRequired, async (req, res, next) => {
  //console.log(req.cookies);
});

// 회원가입 api (아래는 /register이지만, 실제로는 /api/user/register로 요청해야 함.)
userRouter.post("/register", async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }
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

export { userRouter };
