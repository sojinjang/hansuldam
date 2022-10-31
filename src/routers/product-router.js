import { Router } from "express";
import is from "@sindresorhus/is";

import { loginRequired } from "../middlewares";
import { productService } from "../services";

const productRouter = Router();

// 상품 등록 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)
// 권한 체크 로직 추가필요
productRouter.post("/products", async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request)의 body 에서 데이터 가져오기
    // 논의 필요
    const { title, price, password, brand, content } = req.body;

    // 위 데이터를 상품 db에 추가하기
    const newProduct = await productService.addProduct({
      title,
      price,
      brand,
      content,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// 전체 상품 목록을 가져옴 (배열 형태)
// 권한 체크 로직 추가필요
productRouter.get("/products", async (req, res, next) => {
  try {
    // 전체 상품 목록을 얻음
    const products = await productService.getProducts();

    // 상품 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// 상품 정보 수정
productRouter.patch("/products/:productId", async (req, res, next) => {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // params로부터 id를 가져옴
    const { productId } = req.params;

    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const { title, price, password, brand, content } = req.body;

    // 위 데이터를 상품 db에 추가하기
    const updateProduct = await productService.setProduct({
      title,
      price,
      brand,
      content,
    });

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json(updateProduct);
  } catch (error) {
    next(error);
  }
});

export { productRouter };
