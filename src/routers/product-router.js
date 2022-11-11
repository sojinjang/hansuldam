import { Router } from "express";
import { productService } from "../services";

const productRouter = Router();

// 전체 상품 목록을 가져옴 (배열 형태)
productRouter.get("/", async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 9);

    // 전체 상품 목록을 얻음
    let products = await productService.getProducts();
    // 페이지네이션
    let arr = [];
    for (let i = 0; i < products.length; i++) {
      arr.push(products[i]);
    }

    const productsPerPage = arr.slice(
      perPage * (page - 1),
      perPage * (page - 1) + perPage
    );

    const total = arr.length;
    const totalPage = Math.ceil(total / perPage);
    products = productsPerPage;
    const result = {
      totalPage,
      total,
      products,
    };
    // 상품 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// 상품 상세 정보를 가져옴
productRouter.get("/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      throw new BadRequest("Undefined params", 4005);
    }
    const product = await productService.getProductById(productId);

    // 상품 목록을 JSON 형태로 프론트에 보냄
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

export { productRouter };
