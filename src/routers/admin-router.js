import { Router } from "express";
import is from "@sindresorhus/is";

import { productService , userService } from "../services";

const adminRouter = Router();

// ---- 상품관련
// 제품 추가
adminRouter.post("/products", async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request)의 body 에서 데이터 가져오기
    // 논의 필요
    const { name, price, category, image, brand } = req.body;

    // 위 데이터를 상품 db에 추가하기
    const newProduct = await productService.addProduct({
      name,
      price,
      category,
      image,
      brand,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// 상품 정보 수정
adminRouter.patch("/products/:productId", async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const { productId } = req.params;

    const { name, price, category, image, brand } = req.body;

    // 위 데이터를 상품 db에 추가하기
    const updateProduct = await productService.updateProduct(productId, {
      name,
      price,
      category,
      image,
      brand
    });

    // 업데이트 이후의 데이터를 프론트에 보내 줌
    res.status(200).json(updateProduct);
  } catch (error) {
    next(error);
  }
});

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


export { adminRouter };