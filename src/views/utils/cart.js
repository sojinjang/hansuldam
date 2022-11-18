import * as api from "../api.js";
import { saveItems } from "../../utils/localStorage.js";
import { Keys } from "../constants/Keys.js";
import { ApiUrl } from "../constants/ApiUrl.js";

function isEmptyCart(productsList) {
  return productsList == null || productsList.length === 0;
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

export { isEmptyCart, getCartInfoFromDB, updateCartInfoToDB };
