import * as api from "../api.js";
import { getSavedItems, saveItems } from "../../utils/localStorage.js";
import { Keys } from "../constants/Keys.js";
import { ApiUrl } from "../constants/ApiUrl.js";

function isEmptyCart(productsList) {
  return productsList == null || productsList.length === 0;
}

function removeProductFromLocalDB(productId) {
  let cartProducts = getSavedItems(Keys.CART_KEY);
  cartProducts = cartProducts.filter((product) => String(product._id) !== String(productId));
  return cartProducts;
}

function adjustQuantityFromLocalDB(productId, quantity) {
  const savedProducts = getSavedItems(Keys.CART_KEY);
  const index = savedProducts.findIndex((x) => x._id === productId);
  savedProducts[index].quantity = quantity;
  saveItems(Keys.CART_KEY, savedProducts);
}

function refineDataForPatch(productsArr) {
  const productsInCart = [];
  if (!isEmptyCart(productsArr)) {
    productsArr.map((obj) => {
      productsInCart.push({ id: obj._id, quantity: obj.quantity });
    });
  }
  return productsInCart;
}

async function getCartInfoFromDB() {
  try {
    const cartItemsFromDB = await api.get(ApiUrl.CART);
    if (!isEmptyCart(cartItemsFromDB)) saveItems(Keys.PRODUCTS_KEY, cartItemsFromDB);
  } catch (err) {
    alert(err.message);
  }
}

async function updateCartInfoToDB(productsArr) {
  try {
    const productsInCart = refineDataForPatch(productsArr);
    await api.patch(ApiUrl.CART, "", { productsInCart: productsInCart });
  } catch (err) {
    alert(err.message);
  }
}

export {
  isEmptyCart,
  adjustQuantityFromLocalDB,
  removeProductFromLocalDB,
  getCartInfoFromDB,
  updateCartInfoToDB,
};
