import { Router } from "express";
import { isEmptyObject, loginRequired, adminRequired } from "../middlewares";
import { orderService } from "../services";
import { BadRequest } from "../utils/errorCodes";

const orderRouter = Router();
const authRouter = Router();
const adminRouter = Router();

orderRouter.use("/auth", loginRequired, authRouter);
orderRouter.use("/admin", loginRequired, adminRequired, adminRouter);

//-----주문
// 전체 주문 목록을 가져옴 (관리자)
adminRouter.get("/", async (req, res, next) => {
  try {
    // 전체 주문 목록을 얻음
    const order = await orderService.getOrders();

    // 주문 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

// 주문 수정 관리자
adminRouter.patch("/:orderId", isEmptyObject, async (req, res, next) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      throw new BadRequest("Undefined params", 4005);
    }

    const {
      fullName,
      productsInOrder,
      phoneNumber,
      address,
      payment,
      status,
      totalPrice,
      shipping,
    } = req.body;

    // 위 데이터를 카테고리 db에 추가하기
    const updateOrder = await orderService.updateOrderAdmin(orderId, {
      fullName,
      productsInOrder,
      phoneNumber,
      address,
      payment,
      status,
      totalPrice,
      shipping,
    });

    // 업데이트 이후의 데이터를 프론트에 보내 줌
    res.status(200).json(updateOrder);
  } catch (error) {
    next(error);
  }
});

// 주문 삭제(관리자)
adminRouter.delete("/:orderId", async (req, res, next) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      throw new BadRequest("Undefined params", 4005);
    }

    const order = await orderService.deleteOrder(orderId);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

// 회원 주문하기
authRouter.post("/", isEmptyObject, async (req, res, next) => {
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
    const newOrder = await orderService.authAddOrder({
      userId,
      fullName,
      address,
      shipping,
      payment,
      totalPrice,
      productsInOrder,
      phoneNumber,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

// 주문 추가
orderRouter.post("/", isEmptyObject, async (req, res, next) => {
  try {
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
      fullName,
      address,
      shipping,
      payment,
      productsInOrder,
      totalPrice,
      phoneNumber,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

// 주문 수정 구매자
orderRouter.patch("/:orderId", isEmptyObject, async (req, res, next) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      throw new BadRequest("Undefined params", 4005);
    }
    const {
      fullName,
      productsInOrder,
      phoneNumber,
      address,
      payment,
      totalPrice,
    } = req.body;

    // 위 데이터를 카테고리 db에 추가하기
    const updateOrder = await orderService.updateOrder(orderId, {
      fullName,
      productsInOrder,
      phoneNumber,
      address,
      payment,
      totalPrice,
    });
    res.status(200).json(updateOrder);
  } catch (error) {
    next(error);
  }
});

// 주문 취소 구매자
orderRouter.delete("/:orderId", async (req, res, next) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      throw new BadRequest("Undefined params", 4005);
    }
    const order = await orderService.deleteOrder(orderId);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

// 주문 상세 정보를 가져옴
orderRouter.get("/:orderId", async (req, res, next) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      throw new BadRequest("Undefined params", 4005);
    }
    const order = await orderService.getOrderById(orderId);

    // 주문 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

// 주문한 상품 리스트를 가져옴
orderRouter.get("/:orderId/products", async (req, res, next) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      throw new BadRequest("Undefined params", 4005);
    }
    //{ id , quantity }
    const { productsInOrder } = await orderService.getOrderList(orderId);

    const productObjs = await productService.getProductObj(productsInOrder);

    // 주문 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(productObjs);
  } catch (error) {
    next(error);
  }
});

export { orderRouter };
