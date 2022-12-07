import { Router } from "express";
import { BadRequest } from "../utils/errorCodes";
import { isEmptyObject, loginRequired, adminRequired } from "../middlewares";

import { categoryService, productService } from "../services";

const categoryRouter = Router();
const adminRouter = Router();

categoryRouter.use("/admin", loginRequired, adminRequired, adminRouter);

// 카테고리 추가 (관리자)
adminRouter.post("/", isEmptyObject, async (req, res, next) => {
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
adminRouter.patch("/:categoryId", isEmptyObject, async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      throw new BadRequest("Undefined params", 4005);
    }

    const { name } = req.body;

    // 위 데이터를 카테고리 db에 추가하기
    const updateCategory = await categoryService.updateCategory(categoryId, name);

    // 업데이트 이후의 데이터를 프론트에 보내 줌
    res.status(200).json(updateCategory);
  } catch (error) {
    next(error);
  }
});

// 카테고리 삭제(관리자)
adminRouter.delete("/:categoryId", async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      throw new BadRequest("Undefined params", 4005);
    }
    const noneCategory = await categoryService.deleteCategory(categoryId);

    res.status(200).json(noneCategory);
  } catch (error) {
    next(error);
  }
});

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
    if (!categoryId) {
      throw new BadRequest("Undefined params", 4005);
    }
    const category = await categoryService.getCategoryById(categoryId);

    // 카테고리 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
});

//카테고리 상품목록 가져오기
categoryRouter.get("/:categoryId/products", async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      throw new BadRequest("Undefined params", 4005);
    }
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 9);
    const pageObj = { page, perPage };

    const result = await categoryService.getProductsByCategoryId(pageObj, categoryId);

    // 주문 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export { categoryRouter };
