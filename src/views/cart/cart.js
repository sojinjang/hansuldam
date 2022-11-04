import footer from "../template/footer/footer.js";
import header from "../template/header/header.js";

const main = document.querySelector(".body-container");

main.insertAdjacentHTML("beforebegin", header());
main.insertAdjacentHTML("afterend", footer());

const productForm = document.getElementById("product-form");
const productInput = document.querySelector("#product-form input");
const shoppingbagList = document.querySelector(".shoppingbag-list");

const PRODUCTS_KEY = "products";

let productArr = [
  {
    _id: "249ee1e45022fa608b63e994",
    category: "증류주",
    brand: "전주이강주",
    name: "조정형 명인 전주 이강주",
    price: 5500,
    volume: 375,
    quantity: 200,
    img: "../img/redmonkey.jpeg",
    sold: 10,
    alcoholType: "증류",
    alcoholDegree: 19,
    manufacturedDate: "2022-04-15",
    createdAt: "2022-06-07T05:28:04.709Z",
    updatedAt: "2022-06-07T05:32:19.548Z",
  },
  {
    _id: "249ee1e45022fa608b63e994",
    category: "증류주",
    brand: "전주이강주",
    name: "조정형 명인 전주 이강주",
    price: 5500,
    volume: 375,
    quantity: 200,
    img: "../img/redmonkey.jpeg",
    sold: 10,
    alcoholType: "증류",
    alcoholDegree: 19,
    manufacturedDate: "2022-04-15",
    createdAt: "2022-06-07T05:28:04.709Z",
    updatedAt: "2022-06-07T05:32:19.548Z",
  },
];

function saveProducts() {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(productArr));
}

function deleteProduct(event) {
  const productInfoDiv = event.target.parentElement;
  const productDiv = productInfoDiv.productInfoDiv;
  productDiv.remove();
  products = products.filter((product) => product.id !== parseInt(li.id));
  saveProducts();
}

function showProducts(item) {
  let product = undefined;
  product = document.createElement("div");
  product.setAttribute("class", "product");
  product.innerHTML = `<div class="checkbox-wrapper">
                <button type="button" class="custom-checkbox">
                  <img
                    class="checkbox-img"
                    src="../img/check.png"
                    alt="checkbox"
                  />
                </button>
              </div>
              <div class="product-info-top">
                <div class="thumbnail">
                  <img class="product-img" src="../img/redmonkey.jpeg" />
                </div>
                <div class="product-info">
                  <div class="product-brand">${item.brand}</div>
                  <div class="product-name">${item.name}</div>
                  <div class="product-volume">${item.volume}</div>
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
                <div class="price">${item.price}</div>
              </div>`;
  shoppingbagList.append(product);
}

// let productArr = [];

function testShowProducts(productObj) {
  let product = undefined;
  product = document.createElement("div");
  product.setAttribute("class", "product");
  product.innerHTML = `<div class="checkbox-wrapper">
                <button type="button" class="custom-checkbox">
                  <img
                    class="checkbox-img"
                    src="../img/check.png"
                    alt="checkbox"
                  />
                </button>
              </div>
              <div class="product-info-top">
                <div class="thumbnail">
                  <img class="product-img" src="../img/redmonkey.jpeg" />
                </div>
                <div class="product-info">
                  <div class="product-brand">배상면주가</div>
                  <div class="product-name">${productObj}</div>
                  <div class="product-volume">375ml</div>
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
                  <div class="amount">1</div>
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
                <div class="price">7900원</div>
              </div>`;
  shoppingbagList.append(product);
}

function handleProductSubmit(event) {
  event.preventDefault();
  const newProduct = productInput.value;
  productInput.value = "";
  const newProductObj = {
    text: newProduct,
    id: Date.now(),
  };
  // productArr.push(newProductObj);
  testShowProducts(newProduct);
  // showProducts(productArr);
  saveProducts();
}

productForm.addEventListener("submit", handleProductSubmit);

const savedProducts = localStorage.getItem(PRODUCTS_KEY);

if (savedProducts !== null) {
  const parsedProducts = JSON.parse(savedProducts);
  console.log(parsedProducts);
  console.log(parsedProducts[0].price);
  productArr = parsedProducts;
  parsedProducts.forEach(showProducts);
}
