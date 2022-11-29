const { category } = require("./category");
const { product } = require("./product");
const { user } = require("./user");
const { order } = require("./order");
const { comment } = require("./comment");

async function setTestdata() {
  console.log("category 넣는 중");
  await category();

  console.log("product 넣는 중");
  await product();

  console.log("user 넣는 중");
  await user();

  console.log("order 넣는 중");
  await order();

  console.log(" comment 완료");
  await comment();

  console.log(" testdata 완료");

  return;
}

module.exports = { setTestdata };
