import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';

const Category = model('category', CategorySchema);

export class CategoryModel {

    // 1. create
    async createCategory(categoryInfo){
        const newCategory = await Category.create(categoryInfo);
        return newCategory;
    }
    // 2. delete
    async deleteCategory(categoryId){
        const deleteCategory = await Category.deleteOne({_id: categoryId});
        return deleteCategory;
    }
    // 3. read all
    async findAllCategories(){
        const categorylist = await Category.find({})
        return categorylist;
    }
    // 4. read name
    async findByCategoryName(categoryName){
        const category = await Category.findOne({name: categoryName});
        return category;
    }

    // 5. update
    async updateCategory({categoryId, name}){
        const filter = {_id: categoryId};
        const update = {name: name};
        const option = { returnOriginal: false };
        const updateCategory = await Category.updateOne(filter, update, option);
        return updateCategory;
    }
}

const categoryModel = new CategoryModel();

export { categoryModel }
