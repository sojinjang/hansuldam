import { Router } from "express";
import is from "@sindresorhus/is";

import { categoryService } from "../services";

const categoryRouter = Router();

// 카테고리 추가 (관리자)
categoryRouter.post("/admin/category", async (req, res, next) => {
  try {// body가 아닌 req.name? 안되면!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request)의 body 에서 데이터 가져오기
    const { name } = req.body;

    // 위 데이터를 카테고리 db에 추가하기
    const newCategory = await categoryService.addCategory({
      name
    });

    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
});

// 카테고리 정보 수정
categoryRouter.patch("/admin/category/:categoryId", async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }
    
    const { categoryId } = req.params;

    const { name } = req.body;

    // 위 데이터를 카테고리 db에 추가하기
    const updateCategory = await categoryService.updateCategory(categoryId, {
      name,
    });

    // 업데이트 이후의 데이터를 프론트에 보내 줌
    res.status(200).json(updateCategory);
  } catch (error) {
    next(error);
  }
});

// 카테고리 삭제(관리자)
categoryRouter.delete("/admin/category/:categoryId}", async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const category = await categoryService.deleteCategory(categoryId);

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
});

// 전체 카테고리 목록을 가져옴 (배열 형태)
categoryRouter.get("/category", async (req, res, next) => {
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
categoryRouter.get("/category/:categoryId", async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const category = await categoryService.getProductById(categoryId);

    // 카테고리 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
});

export { categoryRouter };
