import { model } from "mongoose";
import { CategorySchema } from "../schemas/category-schema";

const Category = model("categories", CategorySchema);

export class CategoryModel {
  async create(categoryInfo) {
    const createdNewCategory = await Category.create(categoryInfo);
    return createdNewCategory;
  }

  async findAll() {
    const categories = await Category.find();
    return categories;
  }

  async update({ categoryId, update }) {
    const filter = { _id: categoryId };
    const option = { returnOriginal: false };
    const updatedCategory = await Category.findOneAndUpdate(filter, update, option);
    return updatedCategory;
  }

  async delete({ categoryId }) {
    const filter = { _id: categoryId };
    const deletedCategory = await Category.deleteOne(filter);
    return deletedCategory;
  }

  async findByObj(obj) {
    const category = await Category.findOne(obj);

    return category;
  }
}

const categoryModel = new CategoryModel();

export { categoryModel };
