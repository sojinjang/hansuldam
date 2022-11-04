import { model } from "mongoose";
import { CartSchema } from "../schemas/cart-schema";

const Cart = model("carts", CartSchema);

export class CartModel {
  async create(cartInfo) {
    const createdNewCart = await Cart.create(cartInfo);
    return createdNewCart;
  }

  async findAll() {
    const categories = await Cart.find();
    return categories;
  }

  async update({ cartId, update }) {
    const filter = { _id: cartId };
    const option = { returnOriginal: false };
    const updatedCart = await Cart.findOneAndUpdate(filter, update, option);
    return updatedCart;
  }

  async delete({ cartId }) {
    const filter = { _id: cartId };
    const deletedCart = await Cart.deleteOne(filter);
    return deletedCart;
  }

  async findByObj(obj) {
    const cart = await Cart.findOne(obj);
    return cart;
  }
}

const cartModel = new CartModel();

export { cartModel };
