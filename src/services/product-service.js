import fs from "fs";
import { productModel, categoryModel } from "../db";
import { BadRequest, NotFound } from "../utils/errorCodes";
import { pagination, totalPageCacul, makeFilterObj } from "../utils";

class ProductService {
  constructor(productModel, categoryModel) {
    this.productModel = productModel;
    this.categoryModel = categoryModel;
  }

  // 상품추가(관리자)
  async addProduct(productInfo) {
    const { name, category } = productInfo;
    // 카테고리 있는지 확인
    const categoryCheck = await this.categoryModel.findByObj({
      name: category,
    });
    if (!categoryCheck) {
      throw new NotFound("This Category Not in DB", 4403);
    }

    //상품 중복 확인
    const product = await this.productModel.totalCount({ name });
    if (product > 0) {
      throw new BadRequest("Same Name in DB", 4201);
    }

    // db에 저장
    const createdNewProduct = await this.productModel.create(productInfo);

    // category 모델에 product._id 추가
    const categoryFilterObj = { _id: categoryCheck._id };
    const categoryUpdateObj = { $push: { products: createdNewProduct._id } };
    await this.categoryModel.update(categoryFilterObj, categoryUpdateObj);

    return createdNewProduct;
  }

  // 상품 업데이트(관리자)
  // 추후 db 리소스 개선 필요
  async updateProduct(productId, updateObj) {
    // 수정하는 카테고리가 있는지 확인
    const { name, category } = updateObj;
    const categoryCheck = await this.categoryModel.totalCount({
      name: category,
    });
    if (categoryCheck === 0) {
      throw new NotFound("This Category Not in DB", 4403);
    }
    //상품 이름 중복 확인
    const productCheck = await this.productModel.totalCount({ name });
    if (productCheck > 0) {
      throw new BadRequest("Same Name in DB", 4202);
    }

    const filterObj = { _id: productId };
    // 우선 해당 id의 상품이 db에 있는지 확인
    const originProduct = await this.productModel.findByObj(filterObj);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!originProduct) {
      throw new NotFound("This Product Not In DB", 4203);
    }

    //카테고리도 수정하는건지 확인
    const flag = originProduct.category !== category;

    // 원래 카테고리에서 상품 id 삭제
    if (flag) {
      const delFilterObj = {
        name: originProduct.category,
      };
      const deleteObj = { $pull: { products: productId } };
      await this.categoryModel.update(delFilterObj, deleteObj);

      // category 모델에 product._id 추가
      const categoryFilterObj = { name: category };
      const categoryUpdateObj = { $push: { products: productId } };
      await this.categoryModel.update(categoryFilterObj, categoryUpdateObj);
    }

    // 업데이트 진행
    const product = await this.productModel.update(filterObj, updateObj);

    return product;
  }

  // 상품삭제
  async deleteProduct(productId) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    const product = await this.productModel.findByObj({ _id: productId });
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!product) {
      throw new NotFound("This Product Not In DB", 4203);
    }

    if (product.image) {
      if (fs.existsSync(product.image)) {
        // 파일이 존재한다면 true 그렇지 않은 경우 false 반환
        try {
          fs.unlinkSync(product.image);
        } catch (error) {
          throw new BadRequest("Fail Delete Image", 4007);
        }
      }
    }

    // 카테고리에서 상품id 지우기
    const filterObj = { name: product.category };
    const updateObj = { $pull: { products: productId } };

    await this.categoryModel.update(filterObj, updateObj);

    // 삭제 진행
    const deletedProduct = await this.productModel.delete(productId);

    return deletedProduct;
  }

  // 상품 목록 조회
  async getProducts(pageObj) {
    const { page, perpage } = pageObj;

    const { skip, limit } = pagination(page, perpage);

    const total = await this.productModel.totalCount({});
    const totalPage = totalPageCacul(perpage, total);

    const products = await this.productModel.findAll(skip, limit);

    return { products, totalPage };
  }

  // 상품 필터링 조회
  async getfilteredProducts(pageObj, inputFilterObj) {
    const { page, perpage } = pageObj;

    const { skip, limit } = pagination(page, perpage);

    const { filterObj, sortObj } = makeFilterObj(inputFilterObj);

    const products = await this.productModel.findFiltered(skip, limit, sortObj, filterObj);

    const total = await this.productModel.totalCount(filterObj);
    const totalPage = totalPageCacul(perpage, total);

    return { products, totalPage };
  }

  // 상품 목록 조회
  async getProductById(productId) {
    const products = await this.productModel.findByObj({ _id: productId });
    return products;
  }

  // 이미지 경로 저장
  async updateProductImage(productId, image) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    const filterObj = { _id: productId };
    let product = await this.productModel.findByObj(filterObj);

    if (!product) {
      try {
        fs.unlinkSync(image);
      } catch (error) {
        throw new BadRequest("Fail Delete Image", 4007);
      }
      throw new NotFound("This Product Not In DB", 4203);
    }

    if (product.image) {
      if (fs.existsSync(product.image)) {
        // 파일이 존재한다면 true 그렇지 않은 경우 false 반환
        try {
          fs.unlinkSync(product.image);
        } catch (error) {
          throw new BadRequest("Fail Delete Image", 4007);
        }
      }
    }
    const updateObj = { image };
    // 업데이트 진행
    product = await this.productModel.update(filterObj, updateObj);

    return product;
  }

  async getProductList(productList) {
    const products = await this.productModel.findByIdArray(productList);
    return products;
  }
}

const productService = new ProductService(productModel, categoryModel);

export { productService };
