const { productModel, categoryModel } = require("../src/db");
const { sampleProductDatas } = require("./sample-product");
const { getRandomInt } = require("./get-random-int");
const path = require("path");
const fs = require("fs");

async function product() {
  try {
    const sampleRoute = path.join("testdata", "sample-img");
    const saveRoute = path.join("src", "views", "img", "products");

    const saveImg = fs.readdirSync(sampleRoute);

    const productDatas = sampleProductDatas.map((product) => {
      const img = saveImg.find((ele) => ele.slice(0, -4) == product.name);
      if (img) {
        product.image = path.join(saveRoute, img);
      } else {
        const ran = getRandomInt(0, saveImg.length);
        product.image = path.join(saveRoute, saveImg[ran]);
      }
      return product;
    });

    const products = await productModel.setTestdata(productDatas);
    await Promise.all(
      products.map(async (cur) => {
        const filterObj = { name: cur.category };
        const curId = cur._id.toString();
        const toUpdate = { $push: { products: curId } };
        await categoryModel.update(filterObj, toUpdate);
      })
    );
  } catch (error) {
    console.log(error);
  }
}
module.exports = { product };
