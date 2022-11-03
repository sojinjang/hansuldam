import { Router } from "express";

import { categoryService, productService } from "../services";

const categoryRouter = Router();

// 전체 카테고리 목록을 가져옴 (배열 형태)
categoryRouter.get("/", async (req, res, next) => {
  try {
    // 전체 카테고리 목록을 얻음
    const category = await categoryService.getCategories();

    // 카테고리 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
});

// 카테고리 상세 정보를 가져옴 (배열 형태)
categoryRouter.get("/:categoryId", async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const category = await categoryService.getCategoryById(categoryId);

    // 카테고리 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
});

categoryRouter.get("/:categoryId/products", async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const { productList } = await categoryService.getCategoryById(categoryId);

    const products = await productService.getProductList(productList);

    // 주문 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

export { categoryRouter };
