import { Router } from "express";
import { isEmptyObject, loginRequired } from "../middlewares";
import { cartService } from "../services";

const cartRouter = Router();
const authRouter = Router();
cartRouter.use("/auth", loginRequired, authRouter);

// 회원 장바구니
authRouter.patch("/", isEmptyObject, async (req, res, next) => {
  try {
    const userId = req.currentUser.userId;

    // req (request)의 body 에서 데이터 가져오기
    const { productsInCart } = req.body;

    // 위 데이터를 주문 db에 추가하기
    const newCart = await cartService.addCart({
      userId,
      productsInCart,
    });

    res.status(201).json(newCart);
  } catch (error) {
    next(error);
  }
});

// 장바구니 조회
authRouter.get("/", async (req, res, next) => {
  try {
    const userId = req.currentUser.userId;

    // 위 데이터를 주문 db에 추가하기
    const productsInCart = await cartService.getCartList(userId);
    res.status(201).json(productsInCart);
  } catch (error) {
    next(error);
  }
});

export { cartRouter };
