import { productModel } from "../db";
import { categoryService } from "./";
import { BadRequest, NotFound } from "../utils/errorCodes";

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
      throw new BadRequest("Same Name in DB", 4201);
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
      throw new NotFound("This Product Not In DB", 4203);
    }
    //상품 이름 중복 확인
    product = await this.productModel.findByName(toUpdate.name);
    if (product) {
      throw new BadRequest("Same Name in DB", 4202);
    }
    // 업데이트 진행
    product = await this.productModel.update({
      productId,
      update: toUpdate,
    });

    const { category } = toUpdate;
    // category 모델에 product._id 추가
    const filterObj = { name: category };
    const Update = { $push: { products: productId } };
    await categoryService.updateCategory(filterObj, Update);

    return product;
  }

  async updateProductImage(productId, image) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let product = await this.productModel.findById(productId);

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

    // 업데이트 진행
    product = await this.productModel.update({
      productId,
      update: { image },
    });

    return product;
  }

  async deleteProduct(productId) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let product = await this.productModel.findById(productId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!product) {
      throw new NotFound("This Product Not In DB", 4203);
    }

    // 업데이트 진행
    const deletedProduct = await this.productModel.delete(productId);
    return deletedProduct;
  }

  async getProductList(productList) {
    const products = await this.productModel.findByIdArray(productList);
    return products;
  }
  // productsInOrder = [{ id , quantity }...]
  // id 를 product 정보 객체로 바꿔주는 함수
  async getProductObj(productsInOrder) {
    const productIdArr = productsInOrder.map(({ id }) => id);

    const products = await this.productModel.findByIdArray(productIdArr);
    function compareId(a, b) {
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 0;
    }
    await products.sort(function (a, b) {
      return compareId(a._id.toString(), b._id.toString());
    });

    await productsInOrder.sort(function (a, b) {
      return compareId(a.id, b.id);
    });

    let productsIn = [];
    await productsInOrder.forEach((cur, idx) => {
      const product = products[idx];
      const quantity = cur.quantity;
      productsIn.push({ product, quantity });
    });

    return productsIn;
  }
}

const productService = new ProductService(productModel);

export { productService };
