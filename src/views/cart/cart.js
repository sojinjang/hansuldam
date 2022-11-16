import { getSavedItems, saveItems } from "../utils/localStorage.js";
import { getCookieValue } from "../utils/cookie.js";
import { Keys } from "../constants/Keys.js";

const shoppingbagList = document.querySelector(".shoppingbag-list");

const allChecker = document.querySelector(".all-checker");
const selectedItemDeleteButton = document.querySelector(".selected-item-delete-button");
const totalProductPrice = document.querySelector(".total-product-price");
const deliveryFee = document.querySelector(".delivery-fee");
const totalPrice = document.querySelector(".total-payment-price");
const checkoutButton = document.querySelector(".checkout");

const HIDDEN_CLASSNAME = "hidden";

function removeProductFromDB(productId) {
  let savedProducts = getSavedItems(Keys.PRODUCTS_KEY);
  savedProducts = savedProducts.filter(
    (product) => String(product._id) !== String(productId)
  );
  return savedProducts;
}

function adjustQuantityFromDB(productId, quantity) {
  const savedProducts = getSavedItems(Keys.PRODUCTS_KEY);
  const index = savedProducts.findIndex((x) => x._id === productId);
  savedProducts[index].quantity = parseInt(quantity);
  saveItems(Keys.PRODUCTS_KEY, savedProducts);
}

function isEmptyCart(productsList) {
  return productsList == null || productsList.length === 0;
}

function showProduct(item) {
  let product = undefined;
  product = document.createElement("div");
  product.setAttribute("class", "product");
  product.setAttribute("id", item._id);
  product.innerHTML = `<div class="checkbox-wrapper">
                <input type="checkbox" checked="checked" name="individual-checker" id=${
                  item._id
                } class=individual-checker /><label
                  for="checker"
                ></label>
              </div>
              <div class="product-info-top">
                <div class="thumbnail">
                  <img class="product-img" src="../img/redmonkey.jpeg" />
                </div>
                <div class="product-info">
                  <div class="product-brand">${item.brand}</div>
                  <div class="product-name">${item.name}</div>
                  <div class="product-volume">${item.volume}ml</div>
                </div>
                <button type="button" class="product-remove-button">
                  <img
                    class="remove-img"
                    src="../img/x.png"
                    alt="remove-button"
                  />
                </button>
              </div>
              <div class="blank"></div>
              <div class="product-info-bottom">
                <div class="amount-control">
                  <div class="decrease" id=${item._id}>
                    <button class="minus-button" type="button">
                      <img
                        class="minus-image"
                        src="../img/minus.png"
                        alt="minus"
                      />
                    </button>
                  </div>
                  <div class="amount">${parseInt(item.quantity)}</div>
                  <div class="increase" id=${item._id}>
                    <button class="plus-button" type="button">
                      <img
                        class="plus-image"
                        src="../img/plus.png"
                        alt="plus"
                      />
                    </button>
                  </div>
                </div>
                <div class="price" alt=${item.price}>${(
    item.price * item.quantity
  ).toLocaleString("ko-KR")}원</div>
              </div>`;
  shoppingbagList.append(product);
}

function hideCheckout() {
  checkoutButton.classList.add(HIDDEN_CLASSNAME);
}

function renderCartContents() {
  const savedProducts = getSavedItems(Keys.PRODUCTS_KEY);
  console.log(savedProducts);
  if (!isEmptyCart(savedProducts)) {
    checkoutButton.classList.remove(HIDDEN_CLASSNAME);
    savedProducts.forEach(showProduct);
  } else {
    hideCheckout();
  }
}

function checkAllProducts(e) {
  const checkboxList = document.querySelectorAll(".individual-checker");
  checkboxList.forEach((checkbox) => (checkbox.checked = e.target.checked));
}

function deleteProductFromCart(e) {
  const productDiv = e.target.parentElement.parentElement.parentElement;
  let savedProducts = removeProductFromDB(productDiv.id);
  productDiv.remove();
  saveItems(Keys.PRODUCTS_KEY, savedProducts);
  if (isEmptyCart(savedProducts)) hideCheckout();
}

function getCheckedItems() {
  return document.querySelectorAll("input[name=individual-checker]:checked");
}

function deleteCheckedProducts() {
  const checkedItemList = getCheckedItems();
  checkedItemList.forEach((item) => {
    const productDiv = document.getElementById(item.id);
    let savedProducts = removeProductFromDB(productDiv.id);
    productDiv.remove();
    saveItems(Keys.PRODUCTS_KEY, savedProducts);
    if (isEmptyCart(savedProducts)) hideCheckout();
  });
}

function decreaseProductQuantity(e) {
  const decreaseDiv = e.target.parentElement.parentElement;
  const quantity = decreaseDiv.nextElementSibling;
  const price = decreaseDiv.parentElement.nextElementSibling;
  if (quantity.innerText > 1) {
    quantity.innerText -= 1;
    adjustQuantityFromDB(decreaseDiv.id, quantity.innerText);
    setProductPrice(quantity.innerText, price);
  }
}

function increaseProductQuantity(e) {
  const increaseDiv = e.target.parentElement.parentElement;
  const quantity = increaseDiv.previousElementSibling;
  const price = increaseDiv.parentElement.nextElementSibling;
  quantity.innerText = parseInt(quantity.innerText) + 1;
  adjustQuantityFromDB(increaseDiv.id, quantity.innerText);
  setProductPrice(quantity.innerText, price);
}

function setProductPrice(quantity, price) {
  const pricePerItem = price.getAttribute("alt");
  const productPrice = quantity * pricePerItem;
  price.innerText = `${productPrice.toLocaleString("ko-KR")}원`;
}

function getPureDigit(numStr) {
  const regex = /[^0-9]/g;
  return String(numStr).replace(regex, "");
}

function getTotalProductPrice() {
  const checkedItemList = getCheckedItems();
  let addedPrice = parseInt(0);
  checkedItemList.forEach((item) => {
    const productDiv = document.getElementById(item.id);
    let productPrice = productDiv.querySelector(".price").innerText.slice(0, -1);
    addedPrice += parseInt(getPureDigit(productPrice));
  });
  totalProductPrice.innerText = `${addedPrice.toLocaleString("ko-KR")}원`;
  return addedPrice;
}

function getDeliveryFee(price) {
  const deliveryCharge = price < 50000 ? (price > 0 ? 3000 : 0) : 0;
  deliveryFee.innerText = `${deliveryCharge.toLocaleString("ko-KR")}원`;
  return deliveryCharge;
}

function calculateTotalPrice() {
  const totalProductPrice = getTotalProductPrice();
  const deliveryFee = getDeliveryFee(totalProductPrice);
  totalPrice.innerText = `${(totalProductPrice + deliveryFee).toLocaleString("ko-KR")}원`;
}

function moveToPaymentPage() {
  if (getCookieValue(Keys.TOKEN_KEY)) window.location.href = "/order-pay-member";
  else window.location.href = "/order-pay-nonmember";
}

renderCartContents();
calculateTotalPrice();

const deleteButtons = document.querySelectorAll(".product-remove-button");
const minusButtons = document.querySelectorAll(".minus-button");
const plusButtons = document.querySelectorAll(".plus-button");
const checkboxes = document.querySelectorAll(".individual-checker");

deleteButtons.forEach((deleteButton) => {
  deleteButton.addEventListener("click", deleteProductFromCart);
  deleteButton.addEventListener("click", calculateTotalPrice);
});

allChecker.addEventListener("click", checkAllProducts);
allChecker.addEventListener("click", calculateTotalPrice);

selectedItemDeleteButton.addEventListener("click", deleteCheckedProducts);
selectedItemDeleteButton.addEventListener("click", calculateTotalPrice);

minusButtons.forEach((minusButton) => {
  minusButton.addEventListener("click", decreaseProductQuantity);
  minusButton.addEventListener("click", calculateTotalPrice);
});

plusButtons.forEach((plusButton) => {
  plusButton.addEventListener("click", increaseProductQuantity);
  plusButton.addEventListener("click", calculateTotalPrice);
});

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("click", calculateTotalPrice);
});

checkoutButton.addEventListener("click", moveToPaymentPage);
