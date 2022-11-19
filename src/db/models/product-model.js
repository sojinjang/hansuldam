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

  async findByObj(Obj) {
    const product = await Product.findOne(Obj);
    return product;
  }

  async findByIdArray(idArray) {
    const products = await Product.find({ _id: { $in: idArray } }).sort({
      _id: 1,
    });
    return products;
  }

  async update(filterObj, updateObj) {
    const option = { returnOriginal: false };

    const updatedProduct = await Product.findOneAndUpdate(
      filterObj,
      updateObj,
      option
    );
    return updatedProduct;
  }

  async updateManyByIdArr(IdArray, toUpdateObj) {
    const filterObj = { _id: { $in: IdArray } };
    const option = { returnOriginal: false };

    const updatedProduct = await Product.updateMany(
      filterObj,
      toUpdateObj,
      option
    );
    return updatedProduct;
  }

  async delete(productId) {
    const filter = { _id: productId };
    const deletedProduct = await Product.deleteOne(filter);
    return deletedProduct;
  }

  async setTestdata(arr) {
    await Product.deleteMany({});
    const products = await Product.insertMany(arr);
    return products;
  }
}

const productModel = new ProductModel();

export { productModel };
