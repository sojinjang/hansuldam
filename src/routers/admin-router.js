import { Router } from "express";
import { isEmptyObject } from "../middlewares";

import {
  productService,
  userService,
  orderService,
  categoryService,
  commentService,
} from "../services";

const adminRouter = Router();

// ---- 상품관련
// 제품 추가
adminRouter.post("/products", isEmptyObject, async (req, res, next) => {
  try {
    // req (request)의 body 에서 데이터 가져오기
    const {
      name,
      price,
      volume,
      category,
      image,
      brand,
      description,
      stock,
      sales,
      alcoholType,
      alcoholDegree,
    } = req.body;

    // 위 데이터를 상품 db에 추가하기
    const newProduct = await productService.addProduct({
      name,
      price,
      volume,
      category,
      image,
      brand,
      description,
      stock,
      sales,
      alcoholType,
      alcoholDegree,
    });

    // category 모델에 product._id 추가
    const filterObj = { name: category };
    const toUpdate = { $push: { products: newProduct._id } };
    await categoryService.updateCategory(filterObj, toUpdate);

    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// 상품 정보 수정
adminRouter.patch(
  "/products/:productId",
  isEmptyObject,
  async (req, res, next) => {
    try {
      const { productId } = req.params;

      const {
        name,
        price,
        volume,
        category,
        image,
        brand,
        description,
        stock,
        sales,
        alcoholType,
        alcoholDegree,
      } = req.body;

      // 위 데이터를 상품 db에 추가하기
      const updateProduct = await productService.updateProduct(productId, {
        name,
        price,
        volume,
        category,
        image,
        brand,
        description,
        stock,
        sales,
        alcoholType,
        alcoholDegree,
      });

      // category 모델에 product._id 추가
      const filterObj = { name: category };
      const toUpdate = { $push: { products: updateProduct._id } };
      await categoryService.updateCategory(filterObj, toUpdate);

      // 업데이트 이후의 데이터를 프론트에 보내 줌
      res.status(200).json(updateProduct);
    } catch (error) {
      next(error);
    }
  }
);

// 상품 삭제
adminRouter.delete("/products/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;

    const products = await productService.deleteProduct(productId);

    // 상품 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

//-----유저
// 전체 유저 목록을 가져옴 (배열 형태임)
adminRouter.get("/users", async (req, res, next) => {
  try {
    // 전체 사용자 목록을 얻음
    const users = await userService.getUsers();

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

//-----주문
// 전체 주문 목록을 가져옴 (관리자)
adminRouter.get("/orders", async (req, res, next) => {
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
adminRouter.patch("/orders/:orderId", isEmptyObject, async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const {
      fullName,
      productsInOrder,
      phoneNumber,
      address,
      payment,
      status,
      shipping,
      priceSum,
    } = req.body;

    // 위 데이터를 카테고리 db에 추가하기
    const updateOrder = await orderService.updateOrderAdmin(orderId, {
      fullName,
      productsInOrder,
      phoneNumber,
      address,
      payment,
      status,
      shipping,
      priceSum,
    });

    // 업데이트 이후의 데이터를 프론트에 보내 줌
    res.status(200).json(updateOrder);
  } catch (error) {
    next(error);
  }
});

// 주문 삭제(관리자)
adminRouter.delete("/orders/:orderId", async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await orderService.deleteOrder(orderId);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

// -----카테고리
// 카테고리 추가 (관리자)
adminRouter.post("/category", isEmptyObject, async (req, res, next) => {
  try {
    // req (request)의 body 에서 데이터 가져오기
    const { name } = req.body;

    // 위 데이터를 카테고리 db에 추가하기
    const newCategory = await categoryService.addCategory({
      name,
    });

    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
});

// 카테고리 정보 수정
adminRouter.patch(
  "/category/:categoryId",
  isEmptyObject,
  async (req, res, next) => {
    try {
      const { categoryId } = req.params;

      const { name } = req.body;

      // 위 데이터를 카테고리 db에 추가하기
      const updateCategory = await categoryService.updateCategory(
        { id: categoryId },
        {
          name,
        }
      );

      // 업데이트 이후의 데이터를 프론트에 보내 줌
      res.status(200).json(updateCategory);
    } catch (error) {
      next(error);
    }
  }
);

// 카테고리 삭제(관리자)
adminRouter.delete("/category/:categoryId", async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const category = await categoryService.deleteCategory(categoryId);

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
});

// 모든댓글 조회(관리자)
adminRouter.get("/comments", async (req, res, next) => {
  try {
    const comments = await commentService.getAllComments();

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});

// 댓글 삭제(관리자)
adminRouter.delete("/comments/:commentId", async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const deleted = await commentService.deleteComment(commentId);

    res.status(200).json(deleted);
  } catch (error) {
    next(error);
  }
});

export { adminRouter };
