import { Router } from "express";
import { categoryService } from "../services";


const categoryRouter = Router();

// 카테고리 추가
categoryRouter.post(
    "/:catg",
  //   Required,
    async (req, res, next) => {
      try {
        const { catg } = req.params;
        const newCategory = await categoryService.createCategory(catg);
  
        res.status(201).json(newCategory);
      } catch (err) {
        next(err);
      }
    }
  );

//카테고리 삭제
categoryRouter.delete(
    "/del/:catg",
  //   adminRequired,
    async (req, res, next) => {
      try {
        const { catg } = req.params;
  
        const deleteCategory = await categoryService.deleteCategory(catg);
        res.status(201).json(deleteCategory);
      } catch (err) {
        next(err);
      }
    }
  );

//  전체 카테고리 조회
categoryRouter.get("/categorylist", async (req, res, next) => {
  try {
    const categories = await categoryService.findAllCategories();
    res.status(200).json(categories); 
  } catch (err) {
    next(err);
  }
});

// 카테고리 이름으로 얻기
categoryRouter.get("/:catg", async (req, res, next) => {
  try {
    const categoryName = req.params;
    const category = await categoryService.findByCategoryName(categoryName);
    res.status(200).json(category); 
  } catch (err) {
    next(err);
  }
});


// 카테고리 업데이트
categoryRouter.put(
  "/edit/:catg",
//   adminRequired,
  async (req, res, next) => {
    try {
      const { catg } = req.params;

      const name = req.body.name;

      const updatedCategoryInfo = await categoryService.updateCategory(
        catg,
        name
      );

      res.status(200).json(updatedCategoryInfo);
    } catch (err) {
      next(err);
    }
  }
);

export { categoryRouter };
