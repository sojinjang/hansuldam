import { categoryModel, productModel } from "../db";
import { BadRequest, NotFound } from "../utils/errorCodes";

class CategoryService {
  constructor(categoryModel, productModel) {
    this.categoryModel = categoryModel;
    this.productModel = productModel;
  }

  async addCategory(categoryInfo) {
    // db에 저장
    try {
      const createdNewCategory = await this.categoryModel.create(categoryInfo);
      return createdNewCategory;
    } catch {
      throw new BadRequest("Same Category in DB", 4401);
    }
  }

  async getCategories() {
    const categories = await this.categoryModel.findAll();
    return categories;
  }

  async getCategoryById(categoryId) {
    const category = await this.categoryModel.findByObj({ _id: categoryId });
    return category;
  }

  async updateCategory(categoryId, name) {
    // 우선 해당 id의 카테고리가 db에 있는지 확인
    let category = await this.categoryModel.findByObj({ _id: categoryId });
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!category) {
      throw new NotFound("This Category Not in DB", 4403);
    }
    const toUpdate = { name };
    // 업데이트 진행
    try {
      category = await this.categoryModel.update({ _id: categoryId }, toUpdate);
    } catch {
      throw new BadRequest("This Modify Name already in DB", 4402);
    }

    // 상품 상세 내용중 category 수정
    const productIdArr = category.products;
    const toUpdateObj = { category: name };
    await this.productModel.updateManyByIdArr(productIdArr, toUpdateObj);

    return category;
  }

  async deleteCategory(categoryId) {
    // 우선 해당 id의 카테고리가 db에 있는지 확인
    let category = await this.categoryModel.findByObj({ _id: categoryId });
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!category) {
      throw new NotFound("This Category Not in DB", 4403);
    }

    // 안에 있던 상품들 카테고리를 없음으로 바꿈
    const productIdArr = category.products;
    await this.productModel.updateManyByIdArr(productIdArr, {
      category: "없음",
    });

    // "없음" 카테고리 있는지
    let noneCategoryCheck = await this.categoryModel.totalCount({ name: "없음" });

    // 있으면 상품id 추가후 삭제
    if (noneCategoryCheck > 0) {
      const categoryUpdateObj = { $push: { products: { $each: productIdArr } } };
      const noneCategory = await this.categoryModel.update(
        { name: "없음" },
        categoryUpdateObj
      );

      await this.categoryModel.delete({ categoryId });

      return noneCategory;
    } else {
      // 없으면 카테고리 이름을 없음으로 변경
      const noneCategory = await this.categoryModel.update(
        { _id: categoryId },
        { name: "없음" }
      );
      return noneCategory;
    }
  }
}

const categoryService = new CategoryService(categoryModel, productModel);

export { categoryService };
