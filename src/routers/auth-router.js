import { Router } from "express";
import { isEmptyObject } from "../middlewares";
import { BadRequest } from "../utils/errorCodes";
import { userService, orderService, commentService } from "../services";

const authRouter = Router();

//----- users
// 사용자 정보 조회
authRouter.get("/user", async (req, res, next) => {
  try {
    const userId = req.currentUser.userId;

    const getUserInfo = await userService.getUserOne(userId);

    res.status(200).json(getUserInfo);
  } catch (error) {
    next(error);
  }
});

// 사용자 정보 수정
authRouter.patch("/user", isEmptyObject, async (req, res, next) => {
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
authRouter.delete("/user", async (req, res, next) => {
  try {
    const userId = req.currentUser.userId;

    const deleteUser = await userService.deleteUserOne(userId);

    res.status(200).json(deleteUser);
  } catch (error) {
    next(error);
  }
});

//-----orders
// 회원 주문하기
authRouter.post("/orders", isEmptyObject, async (req, res, next) => {
  try {
    const userId = req.currentUser.userId;

    // req (request)의 body 에서 데이터 가져오기
    const {
      fullName,
      address,
      shipping,
      payment,
      productsInOrder,
      totalPrice,
      phoneNumber,
    } = req.body;

    // 위 데이터를 주문 db에 추가하기
    const newOrder = await orderService.addOrder({
      userId,
      fullName,
      address,
      shipping,
      payment,
      totalPrice,
      productsInOrder,
      phoneNumber,
    });

    await userService.addOrderIdInUser(userId, newOrder._id);

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

//-----carts
// 회원 장바구니
authRouter.patch("/cart", isEmptyObject, async (req, res, next) => {
  try {
    const userId = req.currentUser.userId;

    // req (request)의 body 에서 데이터 가져오기
    const { productsInCart } = req.body;

    // 위 데이터를 주문 db에 추가하기
    const newCart = await userService.addCart({
      userId,
      productsInCart,
    });

    res.status(201).json(newCart);
  } catch (error) {
    next(error);
  }
});

// 장바구니 조회
authRouter.get("/cart", async (req, res, next) => {
  try {
    const userId = req.currentUser.userId;

    // 위 데이터를 주문 db에 추가하기
    const productsInCart = await userService.getCart(userId);
    const gettedCart = { productsInCart };
    res.status(201).json(gettedCart);
  } catch (error) {
    next(error);
  }
});

//------------댓글
authRouter.get("/comments/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      throw new BadRequest("Undefined params", 4005);
    }
    const comments = await commentService.getCommentsByProductId(productId);

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/comments", async (req, res, next) => {
  try {
    const userId = req.currentUser.userId;
    const { productId, content } = req.body;

    const commentInfo = await commentService.addComment({
      productId,
      userId,
      content,
    });

    res.status(200).json(commentInfo);
  } catch (error) {
    next(error);
  }
});

authRouter.patch("/comments/:commentId", async (req, res, next) => {
  try {
    const userId = req.currentUser.userId;
    const { commentId } = req.params;
    if (!commentId) {
      throw new BadRequest("Undefined params", 4005);
    }
    const { content } = req.body;

    const commentInfo = await commentService.userSetComment(userId, commentId, {
      content,
    });

    res.status(200).json(commentInfo);
  } catch (error) {
    next(error);
  }
});

authRouter.delete("/comments/:commentId", async (req, res, next) => {
  try {
    const userId = req.currentUser.userId;
    const { commentId } = req.params;
    if (!commentId) {
      throw new BadRequest("Undefined params", 4005);
    }
    const deleted = await commentService.userDeleteComment(userId, commentId);

    res.status(200).json(deleted);
  } catch (error) {
    next(error);
  }
});

export { authRouter };
