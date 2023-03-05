import { userModel, productModel } from "../db";
import { BadRequest, NotFound } from "../utils/error-codes";
import { sortingCart } from "../utils";

class CartService {
  constructor(userModel, productModel) {
    this.userModel = userModel;
    this.productModel = productModel;
  }

  // 장바구니 update
  async addCart(userInfo) {
    // 객체 destructuring
    const { userId, productsInCart } = userInfo;
    // 이메일 중복 확인
    const updateCart = await this.userModel.update({ _id: userId }, { productsInCart });

    return updateCart;
  }

  // 장바구니 get
  async getCartList(userId) {
    const { productsInCart } = await this.userModel.findById(userId);

    const productIdArr = productsInCart.map(({ id }) => id);

    const products = await this.productModel.findByIdArray(productIdArr);

    if (products.length !== productIdArr.length) {
      throw new NotFound("There is something missing on the product list", 4304);
    }

    const productsIn = sortingCart(products, productsInCart);

    return productsIn;
  }
}

const cartService = new CartService(userModel, productModel);

export { cartService };
