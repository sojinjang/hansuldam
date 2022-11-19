const { productModel } = require("../src/db");
const { categoryService } = require("../src/services");
const { productDatas } = require("./productSample");

async function product() {
  try {
    console.log(productDatas[0]);
    const products = await productModel.setTestdata(productDatas);
    await Promise.all(
      products.map(async (cur) => {
        const filterObj = { name: cur.category };
        const curId = cur._id.toString();
        const toUpdate = { $push: { products: curId } };
        await categoryService.updateCategory(filterObj, toUpdate);
      })
    );
  } catch (error) {
    console.log(error);
  }
}
product();
module.exports = { product };
