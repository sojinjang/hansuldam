const { category } = require("./category");
const { product } = require("./product");
const { user } = require("./user");
const { order } = require("./order");

async function setTestdata() {
  await category();
  await product();
  await user();
  await order();
  return;
}

module.exports = { setTestdata };
