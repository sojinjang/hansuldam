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
      throw new Error("같은 이름의 상품이 있습니다. 다시 확인해주세요");
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
    console.log('1111111')
    let product = await this.productModel.findById(productId);
    console.log('2222222')

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!product) {
      console.log('333333')
      res.status(404);
      throw new Error("일치하는 상품이 없습니다. 다시 한 번 확인해 주세요.");
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
      res.status(404);
      throw new Error("일치하는 상품이 없습니다. 다시 한 번 확인해 주세요.");
    }

    // 업데이트 진행
    const deletedProduct = await this.productModel.delete({productId});
    return deletedProduct;
  }
}

const productService = new ProductService(productModel);

export { productService };
