const {categoryModel} = require('../db/models/category-model');

class CategoryService {
    
    constructor(categoryModel){
        this.categoryModel = categoryModel;
    }

    // 1. create Category
    async createCategory(categoryInfo){

        const {name} = categoryInfo;

        const isCategoryExist = await this.categoryModel.findByCategoryName(name);
        
        if (isCategoryExist){
            throw new Error('이미 존재하는 카테고리입니다.');
        }

        const newCategory = await this.categoryModel.createCategory(categoryInfo);

        return newCategory;
    }

    // 2. delete Category
    async deleteCategory(categoryId){
        
        const deleteCategory = await this.categoryModel.deleteCategory(categoryId);
        return deleteCategory;
    }

    // 3. read all Categories
    async findAllCategories(){
        const categorylist = await this.categoryModel.findAllCategories();
        return categorylist;
    }

    // 4. read Category name 
    async findByCategoryName(categoryName){
        const category = await this.categoryModel.findByCategoryName(categoryName);
        return category;
    }

    // 5. update Category
    async updateCategory(categoryId, name){
        const updateCategory = await this.categoryModel.updateCategory(categoryId, name);
        return updateCategory;
    }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService }
