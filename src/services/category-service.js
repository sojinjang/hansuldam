import { categoryModel } from "../db";

class CategoryService {
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  async addCategory(categoryInfo) {
    const { name } = categoryInfo;

    //상품 중복 확인
    const category = await this.categoryModel.findByName(name);
    if (category) {
      throw new Error("같은 이름의 카테고리가 있습니다. 다시 확인해주세요");
    }

    // db에 저장
    const createdNewCategory = await this.categoryModel.create(categoryInfo);
    return createdNewCategory;
  }

  async getCategories() {
    const categories = await this.categoryModel.findAll();
    return categories;
  }

  async getCategoryById(categoryId) {
    const category = await this.categoryModel.findById(categoryId);
    return category;
  }

  async updateCategory(categoryName, toUpdate) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    const category = await this.categoryModel.findByName(categoryName);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!category) {
      res.status(404);
      throw new Error("일치하는 카테고리가 없습니다. 다시 한 번 확인해 주세요.");
    }
    const { name } = toUpdate
    // 업데이트 진행
    const updatedcategory = await this.categoryModel.update({
        categoryName,
      name,
    });

    return updatedcategory;
  }

  async deleteCategory(categoryName) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    const category = await this.categoryModel.findByName(categoryName);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!category) {
      res.status(404);
      throw new Error("일치하는 카테고리가 없습니다. 다시 한 번 확인해 주세요.");
    }

    // 업데이트 진행
    const deletedCategory = await this.categoryModel.delete({categoryName});
    return deletedCategory;
  }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService };
