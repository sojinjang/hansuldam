import { model } from "mongoose";
import { ProductSchema } from "../schemas/product-schema";

const Product = model("products", ProductSchema);

export class ProductModel { 
  
  //-- 관리자 권한 필요
  async create(productInfo) {
    const createdNewProduct = await Product.create(productInfo);
    return createdNewProduct;
  }

  async update({ productId, update }) {
    const filter = { _id: productId };
    const updatedProduct = await Product.findOneAndUpdate(filter, update, option);
    return updatedProduct;
  }
  
  async delete({ productId}) {
    const filter = { _id: productId };
    const deletedProduct = await Product.deleteOne(filter);
    return deletedProduct;
  }
  
}

const productModel = new ProductModel();

export { productModel };
