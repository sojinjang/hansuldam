const main = document.querySelector(".body-container");
const shoppingbagList = document.querySelector(".shoppingbag-list");

const allChecker = document.querySelector(".all-checker");
const selectedItemDeleteButton = document.querySelector(".selected-item-delete-button");
const totalProductPrice = document.querySelector(".total-product-price");
const deliveryFee = document.querySelector(".delivery-fee");
const totalPrice = document.querySelector(".total-payment-price");
const checkoutButton = document.querySelector(".checkout");

const PRODUCTS_KEY = "products";
const HIDDEN_CLASSNAME = "hidden";

function getSavedProducts() {
  return JSON.parse(localStorage.getItem(PRODUCTS_KEY));
}

function removeProductFromDB(productId) {
  let savedProducts = getSavedProducts();
  savedProducts = savedProducts.filter(
    (product) => String(product._id) !== String(productId)
  );
  return savedProducts;
}

function saveProducts(productsArr) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(productsArr));
}

function adjustQuantityFromDB(productId, quantity) {
  const savedProducts = getSavedProducts();
  const index = savedProducts.findIndex((x) => x._id === productId);
  savedProducts[index].quantity = parseInt(quantity);
  saveProducts(savedProducts);
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

function renderCartContents() {
  const savedProducts = getSavedProducts();
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
  saveProducts(savedProducts);
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
    saveProducts(savedProducts);
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

function caculateTotalPrice() {
  const totalProductPrice = getTotalProductPrice();
  const deliveryFee = getDeliveryFee(totalProductPrice);
  totalPrice.innerText = `${(totalProductPrice + deliveryFee).toLocaleString("ko-KR")}원`;
}

function hideCheckout() {
  checkoutButton.classList.add(HIDDEN_CLASSNAME);
}

let tempData = [
  {
    _id: "249ee1e45022fa608b63e994",
    category: "증류주",
    brand: "전주이강주",
    name: "조정형 명인 전주 이강주",
    price: 5500,
    volume: 375,
    quantity: 1,
    img: "../img/redmonkey.jpeg",
    sold: 10,
    alcoholType: "증류",
    alcoholDegree: 19,
    manufacturedDate: "2022-04-15",
    createdAt: "2022-06-07T05:28:04.709Z",
    updatedAt: "2022-06-07T05:32:19.548Z",
  },
  {
    _id: "5555",
    category: "청주",
    brand: "토박이",
    name: "한산 소곡주",
    price: 11000,
    volume: 500,
    quantity: 3,
    img: "../img/redmonkey.jpeg",
    sold: 13,
    alcoholType: "청주",
    alcoholDegree: 16,
    manufacturedDate: "2022-04-15",
    createdAt: "2022-06-07T05:28:04.709Z",
    updatedAt: "2022-06-07T05:32:19.548Z",
  },
  {
    _id: "1234",
    category: "증류주",
    brand: "제이팍",
    name: "원소주",
    price: 25000,
    volume: 375,
    quantity: 2,
    img: "../img/redmonkey.jpeg",
    sold: 5,
    alcoholType: "증류주",
    alcoholDegree: 21,
    manufacturedDate: "2022-11-05",
    createdAt: "2022-11-07T05:28:04.709Z",
    updatedAt: "2022-11-07T05:32:19.548Z",
  },
];
saveProducts(tempData);

renderCartContents();
caculateTotalPrice();

const deleteButtons = document.querySelectorAll(".product-remove-button");
const minusButtons = document.querySelectorAll(".minus-button");
const plusButtons = document.querySelectorAll(".plus-button");
const checkboxes = document.querySelectorAll(".individual-checker");

deleteButtons.forEach((deleteButton) => {
  deleteButton.addEventListener("click", deleteProductFromCart);
  deleteButton.addEventListener("click", caculateTotalPrice);
});

allChecker.addEventListener("click", checkAllProducts);
allChecker.addEventListener("click", caculateTotalPrice);

selectedItemDeleteButton.addEventListener("click", deleteCheckedProducts);
selectedItemDeleteButton.addEventListener("click", caculateTotalPrice);

minusButtons.forEach((minusButton) => {
  minusButton.addEventListener("click", decreaseProductQuantity);
  minusButton.addEventListener("click", caculateTotalPrice);
});

plusButtons.forEach((plusButton) => {
  plusButton.addEventListener("click", increaseProductQuantity);
  plusButton.addEventListener("click", caculateTotalPrice);
});

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("click", caculateTotalPrice);
});
