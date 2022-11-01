import { Router } from "express";
import { categoryService } from "../services/category-service";


const categoryRouter = Router();

//  전체 카테고리 조회
categoryRouter.get("/category", async (req, res, next) => {
  try {
    const categories = await categoryService.findCategories();
    res.status(200).json(categories); 
  } catch (err) {
    next(err);
  }
});

// 카테고리 별 제품 조회
categoryRouter.get("/category/:categoryId", async (req, res, next) => {
  try {
    const categoryId = req.params;
    const category = await categoryService.findByCategoryId(categoryId);
    res.status(200).json(category); 
  } catch (err) {
    next(err);
  }

// 카테고리 추가 - 어드민
categoryRouter.post(
    "/admin/category",
    async (req, res, next) => {
      try {
        const {name}  = req.body;
        const newCategory = await categoryService.createCategory({name});
  
        res.status(201).json(newCategory);
      } catch (err) {
        next(err);
      }
    }
  );
//카테고리 삭제 - 어드민
categoryRouter.delete(
    "/admin/category/:categoryId",
    async (req, res, next) => {
      try {
        const { categoryId } = req.params;
  
        const deletedCategory = await categoryService.deleteCategory(categoryId);
        res.status(201).json(deletedCategory);
      } catch (err) {
        next(err);
      }
    }
  );
  
// 카테고리 업데이트 - admin에 갈때 어차피 다시해야함
categoryRouter.put(
  "/admin/category/:categoryId",
  async (req, res, next) => {
    try {
      const { categoryId } = req.params;

      const name = req.body.name;

      const updatedCategoryInfo = await categoryService.updateCategory(
        categoryId,
        name
      );

      res.status(200).json(updatedCategoryInfo);
    } catch (err) {
      next(err);
    }
  }
);

});

export { categoryRouter };
