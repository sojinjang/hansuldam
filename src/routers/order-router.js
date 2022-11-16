import { Router } from "express";
import { isEmptyObject } from "../middlewares";
import { orderService } from "../services";

const orderRouter = Router();

// 주문 추가 - userId false로 설정하면 선택으로 들어가고 안들어가고가 될듯?
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
