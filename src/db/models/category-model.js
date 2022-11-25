import { model } from "mongoose";
import { CategorySchema } from "../schemas/category-schema";

const Category = model("categories", CategorySchema);

export class CategoryModel {
  async totalCount(filterObj) {
    const totalCount = await Category.count(filterObj);
    return totalCount;
  }

  async create(categoryInfo) {
    const createdNewCategory = await Category.create(categoryInfo);
    return createdNewCategory;
  }

  async findAll() {
    const categories = await Category.find();
    return categories;
  }
  async findByObj(obj) {
    const category = await Category.findOne(obj);

    return category;
  }

  async update(filterObj, updateObj) {
    const option = { returnOriginal: false };
    const updatedCategory = await Category.findOneAndUpdate(filterObj, updateObj, option);
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

  async setTestdata(arr) {
    await Category.deleteMany({});
    const categories = await Category.insertMany(arr);
    return categories;
  }
}

const categoryModel = new CategoryModel();

export { categoryModel };
