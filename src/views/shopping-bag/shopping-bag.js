import footer from "../template/footer/footer.js";
import header from "../template/header/header.js";

const main = document.querySelector(".body-container");

main.insertAdjacentHTML("beforebegin", header());
main.insertAdjacentHTML("afterend", footer());

const productForm = document.getElementById("product-form");
const productInput = document.querySelector("#product-form input");

const PRODUCTS_KEY = "products";

let productArr = [];

const productElements = {
  product: "div",
  "checkbox-wrapper": "div",
  "custom-checkbox": "button",
  "checkbox-img": "img",
  "product-info-top": "div",
  thumbnail: "div",
  "product-img": "img",
  "product-info": "div",
  "product-brand": "div",
  "product-name": "div",
  "product-volume": "div",
  "product-remove-button": "button",
  "remove-img": "img",
  blank: "div",
  "product-info-bottom": "div",
  "amount-control": "div",
  decrease: "div",
  "minus-button": "button",
  "minus-image": "img",
  amount: "div",
  increase: "div",
  "plus-button": "button",
  "plus-image": "img",
  price: "div",
};

function saveProduct() {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(productArr));
}

function deleteProduct(event) {
  const productInfoDiv = event.target.parentElement;
  const productDiv = productInfoDiv.productInfoDiv;
  productDiv.remove();
  products = products.filter((product) => product.id !== parseInt(li.id));
  saveProducts();
}

function camelize(str) {
  return str.replace(/\W+(.)/g, function (match, chr) {
    return chr.toUpperCase();
  });
}

function makeAllProductElemWithClass(productElementsObj) {
  Object.entries(productElementsObj).forEach(([elemCssClassName, tag]) => {
    window[camelize(elemCssClassName)] = document.createElement(tag);
    window[camelize(elemCssClassName)].setAttribute("class", elemCssClassName);
  });
}

function showProduct(newProduct) {
  makeAllProductElemWithClass(productElements)[
    ("checkbox-wrapper", "product-info-top", "blank", "product-info-bottom")
  ].forEach((elem) => {
    product.appendChild(camelize(elem));
  });
  // notImplemented
}

function handleProductSubmit(event) {
  event.preventDefault();
  const newProduct = productInput.value;
  productInput.value = "";
  const newProductObj = {
    text: newProduct,
    id: Date.now(),
  };
  productArr.push(newProductObj);
  showProduct(newProductObj);
  saveProduct();
}

productForm.addEventListener("submit", handleProductSubmit);

const savedProducts = localStorage.getItem(PRODUCTS_KEY);

if (savedProducts !== null) {
  const parsedProducts = JSON.parse(savedProducts);
  productArr = parsedProducts;
  parsedProducts.forEach(paintProduct);
}
