import { categoryModel } from "../db";
import { BadRequest, NotFound } from "../utils/errorCodes";

class CategoryService {
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
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

  async updateCategory(obj, toUpdate) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let category = await this.categoryModel.findByObj(obj);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!category) {
      throw new NotFound("This Category Not in DB", 4403);
    }

    // 이름 중복 확인
    category = await this.categoryModel.findByName(toUpdate.name);
    if (category) {
      throw new BadRequest("This Modify Name already in DB", 4402);
    }

    const categoryId = category._id;
    // 업데이트 진행
    category = await this.categoryModel.update({
      categoryId,
      update: toUpdate,
    });

    return category;
  }

  async deleteCategory(categoryId) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let category = await this.categoryModel.findByObj({ _id: categoryId });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!category) {
      throw new NotFound("This Category Not in DB", 4403);
    }

    // 업데이트 진행
    const deletedCategory = await this.categoryModel.delete({ categoryId });
    return deletedCategory;
  }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService };
