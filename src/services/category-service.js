const {categoryModel} = require('../db/models/category-model');

class CategoryService {
    
    constructor(categoryModel){
        this.categoryModel = categoryModel;
    }

    // 1. 카테고리 생성
    async createCategory(categoryInfo){

        const {name, products} = categoryInfo;

        const isCategoryExist = await this.categoryModel.findByCategoryName(name);
        
        if (isCategoryExist){
            throw new Error('이미 존재하는 카테고리입니다.');
        }

        const createdCategory = await this.categoryModel.createCategory({name: name, products: products});

        return createdCategory;
    }

    // 2. 카테고리 삭제
    async deleteCategory(categoryId){
        
        const deletedCategory = await this.categoryModel.deleteCategory(categoryId);
        return deletedCategory;
    }

    // 3. 카테고리 전체 조회
    async findCategories(){
        const categories = await this.categoryModel.findCategories();
        return categories;
    }
    // 4. 카테고리 이름 검색
    async findByCategoryName(name){
        const categoryName = await this.categoryModel.findByCategoryName(name);
        return categoryName;
    }
    // 5. 카테고리 id 검색
    async findByCategoryId(categoryId){
        const catgId = await categoryModel.findByCategoryId(categoryId);
        return catgId;
    }

    // 6. 카테고리 수정
    async updateCategory(categoryId, name){
        const updatedCategory = await this.categoryModel.updateCategory(categoryId, name);
        return updatedCategory;
    }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService }
