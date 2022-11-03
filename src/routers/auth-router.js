import { Router } from "express";

import { userService } from "../services";

const authRouter = Router();

// 사용자 정보 조회
authRouter.get("/user", async (req, res, next) => {
  try {
    // params로부터 id를 가져옴
    const userId = req.currentUser.userId;

    const getUserInfo = await userService.getUserOne(userId);

    res.status(200).json(getUserInfo);
  } catch (error) {
    next(error);
  }
});

// 사용자 정보 수정
authRouter.patch("/user", async (req, res, next) => {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // params로부터 id를 가져옴
    const userId = req.currentUser.userId;

    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const email = req.body.email;
    const fullName = req.body.fullName;
    const password = req.body.newPassword;
    const phoneNumber = req.body.phoneNumber;
    const address = req.body.address;

    // body data로부터, 확인용으로 사용할 현재 비밀번호를 추출함.
    const currentPassword = req.body.password;

    // currentPassword 없을 시, 진행 불가
    if (!currentPassword) {
      throw new Error("정보를 변경하려면, 현재의 비밀번호가 필요합니다.");
    }

    const userInfoRequired = { userId, currentPassword };

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(email && { email }),
      ...(fullName && { fullName }),
      ...(password && { password }),
      ...(address && { address }),
      ...(phoneNumber && { phoneNumber }),
    };

    // 사용자 정보를 업데이트함.
    const updatedUserInfo = await userService.setUser(
      userInfoRequired,
      toUpdate
    );

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json(updatedUserInfo);
  } catch (error) {
    next(error);
  }
});

// 사용자 삭제(탈퇴)
authRouter.delete("/user", async (req, res, next) => {
  try {
    // params로부터 id를 가져옴
    const userId = req.currentUser.userId;

    const deleteUser = await userService.deleteUserOne(userId);

    res.status(200).json(deleteUser);
  } catch (error) {
    next(error);
  }
});

export { authRouter };
