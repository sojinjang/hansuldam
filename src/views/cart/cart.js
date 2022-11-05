import footer from "../template/footer/footer.js";
import header from "../template/header/header.js";

const main = document.querySelector(".body-container");

main.insertAdjacentHTML("beforebegin", header());
main.insertAdjacentHTML("afterend", footer());

const shoppingbagList = document.querySelector(".shoppingbag-list");

const PRODUCTS_KEY = "products";

function saveProducts(productsArr) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(productsArr));
}

function deleteProduct(event) {
  const productInfoDiv = event.target.parentElement;
  const productDiv = productInfoDiv.productInfoDiv;
  products = products.filter(
    (product) => product.id !== parseInt(productDiv.id)
  );
  productDiv.remove();
  saveProducts(products);
}

function showProducts(item) {
  let product = undefined;
  product = document.createElement("div");
  product.setAttribute("class", "product");
  product.setAttribute("id", item.id);
  product.innerHTML = `<div class="checkbox-wrapper">
                <input type="checkbox" name="checker" id=buy-checker /><label
                  for="checker1"
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

const savedProducts = localStorage.getItem(PRODUCTS_KEY);

if (savedProducts !== null) {
  const parsedProducts = JSON.parse(savedProducts);
  parsedProducts.forEach(showProducts);
}
