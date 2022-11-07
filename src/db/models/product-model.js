import { model } from "mongoose";
import { ProductSchema } from "../schemas/product-schema";

const Product = model("products", ProductSchema);

export class ProductModel {
  async create(productInfo) {
    const createdNewProduct = await Product.create(productInfo);
    return createdNewProduct;
  }

  async findAll() {
    const products = await Product.find();
    return products;
  }

  async update({ productId, update }) {
    const filter = { _id: productId };
    const option = { returnOriginal: false };

    const updatedProduct = await Product.findOneAndUpdate(
      filter,
      update,
      option
    );
    return updatedProduct;
  }

  async delete(productId) {
    const filter = { _id: productId };
    const deletedProduct = await Product.deleteOne(filter);
    return deletedProduct;
  }

  async findByName(name) {
    const product = await Product.findOne({ name });
    return product;
  }

  async findById(productId) {
    const product = await Product.findOne({ _id: productId });
    return product;
  }

  async findByIdArray(idArray) {
    const products = await Product.find({ _id: { $in: idArray } });
    return products;
  }

  async setTestdata(arr) {
    await Product.deleteMany({});
    const products = await Product.insertMany(arr);
    return products;
  }
}

const productModel = new ProductModel();

export { productModel };
