import { productModel } from "../db";

class ProductService {
  // 본 파일의 맨 아래에서, new ProductService(productModel) 하면, 이 함수의 인자로 전달됨
  constructor(productModel) {
    this.productModel = productModel;
  }

  async addProduct(productInfo) {
    const { name } = productInfo;

    //상품 중복 확인
    const product = await this.productModel.findByName(name);
    if (product) {
      throw NeedChangeName;
    }

    // db에 저장
    const createdNewProduct = await this.productModel.create(productInfo);
    return createdNewProduct;
  }

  async getProducts() {
    const products = await this.productModel.findAll();
    return products;
  }

  async getProductById(productId) {
    const product = await this.productModel.findById(productId);
    return product;
  }

  async updateProduct(productId, toUpdate) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let product = await this.productModel.findById(productId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!product) {
      throw ProductNoInDB;
    }
    //상품 이름 중복 확인
    product = await this.productModel.findByName(toUpdate.name);
    if (product) {
      throw NeedAnotherProductName;
    }
    // 업데이트 진행
    product = await this.productModel.update({
      productId,
      update: toUpdate,
    });

    return product;
  }

  async deleteProduct(productId) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let product = await this.productModel.findById(productId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!product) {
      throw ProductNoInDB;
    }

    // 업데이트 진행
    const deletedProduct = await this.productModel.delete(productId);
    return deletedProduct;
  }

  async getProductList(productList) {
    const products = await this.productModel.findByIdArray(productList);
    return products;
  }
  // productsInOrder = { id , quantity }
  // id 를 product 정보 객체로 바꿔주는 함수
  async getProductObj(productsInOrder) {
    const productObjs = await Promise.all(
      productsInOrder.map(async ({ id, quantity }) => {
        const product = await this.productModel.findById(id);
        return { product, quantity };
      })
    );
    return productObjs;
  }
}

const productService = new ProductService(productModel);

export { productService };
