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

  async update({ categoryName, changeName }) {
    const filter = { categoryName };
    const update = { name: changeName };
    const updatedCategory = await Category.findOneAndUpdate(filter, update);
    return updatedCategory;
  }
  
  async delete({ categoryName }) {
    const filter = { name: categoryName };
    const deletedCategory = await Category.findOneAndRemove(filter);
    return deletedCategory;
  }

  async findByName(name) {
    const category = await Category.findOne({ name });
    return category;
  }

  async findById(categoryId) {
    const category = await Category.findOne({ _id: categoryId });
    return category;
  }
  
}

const categoryModel = new CategoryModel();

export { categoryModel };
