const main = document.querySelector(".body-container");
const shoppingbagList = document.querySelector(".shoppingbag-list");

const allChecker = document.querySelector(".all-checker");
const selectedItemDeleteButton = document.querySelector(".selected-item-delete-button");

const PRODUCTS_KEY = "products";

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

function isEmptyCart(productsList) {
  return productsList == null;
}

function renderCartContents() {
  const savedProducts = getSavedProducts();
  if (!isEmptyCart(savedProducts)) {
    savedProducts.forEach(showProduct);
  }
}

function showProduct(item) {
  let product = undefined;
  product = document.createElement("div");
  product.setAttribute("class", "product");
  product.setAttribute("id", item._id);
  product.innerHTML = `<div class="checkbox-wrapper">
                <input type="checkbox" name="individual-checker" id=${item._id} class=individual-checker /><label
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
                  <div class="decrease">
                    <button class="minus-button" type="button">
                      <img
                        class="minus-image"
                        src="../img/minus.png"
                        alt="minus"
                      />
                    </button>
                  </div>
                  <div class="amount">${item.quantity}</div>
                  <div class="increase">
                    <button class="plus-button" type="button">
                      <img
                        class="plus-image"
                        src="../img/plus.png"
                        alt="plus"
                      />
                    </button>
                  </div>
                </div>
                <div class="price">${item.price}원</div>
              </div>`;
  shoppingbagList.append(product);
}

function checkAllProducts(e) {
  const checkboxList = document.querySelectorAll(".individual-checker");
  checkboxList.forEach((checkbox) => (checkbox.checked = e.target.checked));
}

function deleteProductFromCart(event) {
  const productDiv = event.target.parentElement.parentElement.parentElement;
  let savedProducts = removeProductFromDB(productDiv.id);
  productDiv.remove();
  saveProducts(savedProducts);
}

function deteleCheckedProducts() {
  const checkedItemList = document.querySelectorAll(
    "input[name=individual-checker]:checked"
  );
  checkedItemList.forEach((item) => {
    const productDiv = document.getElementById(item.id);
    let savedProducts = removeProductFromDB(productDiv.id);
    productDiv.remove();
    saveProducts(savedProducts);
  });
}

function controlProductAmount() {}

function caculateProductPrice() {}

function caculateAllProductPrice() {
  // 5만원 이상 무료배송
}

function showEmptyCart() {
  // '장바구니 비어있습니다.' 문구 띄우기
  // checkout 버튼 숨기기
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

const deleteButtons = document.querySelectorAll(".product-remove-button");
deleteButtons.forEach((deleteButton) => {
  deleteButton.addEventListener("click", deleteProductFromCart);
});
allChecker.addEventListener("click", checkAllProducts);
selectedItemDeleteButton.addEventListener("click", deteleCheckedProducts);
