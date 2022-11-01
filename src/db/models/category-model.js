import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';

const Category = model('category', CategorySchema);

export class CategoryModel {

    // 1. 카테고리 생성
    async createCategory(categoryInfo){
        const createdCategory = await Category.create(categoryInfo);
        return createdCategory;
    }
    // 2. 카테고리 삭제
    async deleteCategory(categoryId){
        const deletedCategory = await CategorydeleteOne({_id: categoryId});
        return deletedCategory;
    }
    // 3. 카테고리 전체 조회
    async findCategories(){
        const categories = await Category.find({})
        return categories;
    }
    // 4. 카테고리 이름 검색
    async findByCategoryName(name){
        const categoryName = await Category.findOne({name: name});
        return categoryName;
    }
    // 5. 카테고리 id 검색
    async findByCategoryId(categoryId){
        const catgId = await Category.findById(categoryId)
        return catgId;
    }
    // 6. 카테고리 수정
    async updateCategory({categoryId, name}){
        const filter = {_id: categoryId};
        const update = {name: name};
        const option = { returnOriginal: false };
        const updatedCategory = await Category.updateOne(filter, update, option);
        return updatedCategory;
    }
    
}

const categoryModel = new CategoryModel();

export { categoryModel }
