import { get } from "../api.js";
import { changeToKoreanWon } from "../utils/useful_functions.js";
import { Keys } from "../constants/Keys.js";
import { getSavedItems, saveItems } from "../utils/localStorage.js";
import { ApiUrl } from "../constants/ApiUrl.js";
import { updateCartCount } from "../template/header/header.js";

const $ = (selector) => document.querySelector(selector);

async function renderData() {
  const queryString = new Proxy(new URLSearchParams(window.location.search), {
    get: (params, prop) => params.get(prop),
  });
  const currentId = queryString.id;
  const fetchedData = await get(ApiUrl.PRODUCTS, currentId);
  const {
    _id,
    image,
    category,
    name,
    price,
    volume,
    description,
    alcoholType,
    alcoholDegree,
  } = fetchedData;
  const imageUrl = "../" + decodeURIComponent(image).split("views")[1];

  document.title = `${name} - 한술담 🍶`;

  let productSection = document.createElement("section");

  productSection.setAttribute("class", "product-container");
  productSection.setAttribute("id", _id);
  productSection.innerHTML = `<div class="product-container">
  <div class="image-warpper">
    <img src="${imageUrl}" alt="상품 이미지" />
  </div>
  <div class="content__container">
    <div class="content__main-info">
      <p class="content__item content__category">${category}</p>
      <p class="content__item content__name">${name}</p>
      <p class="content__item content__price">${changeToKoreanWon(price)}원</p>
      <p class="content__desc">${description}</p>
    </div>
    <div class="content__detail-info">
      <p>
        <span class="content__alcoholType">종류</span>
        <span class="content__item content__alcoholType">${alcoholType}</span>
      </p>
      <p>
        <span class="content__alcoholDegree">도수</span>
        <span class="content__item content__alcoholDegree">${alcoholDegree}도</span>
      </p>
      <p>
        <span class="content__volume">용량</span>
        <span class="content__item content__volume">${volume}ml</span>
      </p>
    </div>
      <div class="amount-container">
        <a class="amount-minus-button">-</a>
        <input value="1" type="number" class="amount-input" />
        <a class="amount-plus-button">+</a>
        <div class="total-price-container">
          <span class="total-price-text">총 상품 금액</span>
          <span class="amount-total-price">${changeToKoreanWon(price)}</span>
        </div>
        <div class="button-container">
          <button class="button is-info ml-2" id="order-button">
            주문하기
          </button>
          <button class="button" id="cart-button">장바구니 담기</button>
          <p class="cart-message">장바구니에 담았습니다!</p>
	      </div>
</div>`;

  $(".body-container").prepend(productSection);

  return fetchedData;
}

async function orderAndCart() {
  let productData = await renderData();
  productData["quantity"] = 0;

  const { price, stock } = productData;
  const amountInput = document.querySelector(".amount-input");
  const totalPrice = document.querySelector(".amount-total-price");

  $("#order-button").addEventListener("click", moveToOrderPage);
  $("#cart-button").addEventListener("click", addToCart);
  $(".amount-minus-button").addEventListener("click", decreaseAmount);
  $(".amount-plus-button").addEventListener("click", increaseAmount);

  function moveToOrderPage() {
    productData["quantity"] = +amountInput.value;
    saveItems(Keys.IS_CART_ORDER, false);
    saveItems(Keys.ORDER_KEY, [productData]);

    window.location.href = "/order-pay";
  }

  function addToCart() {
    productData["quantity"] = +amountInput.value;
    if (getSavedItems(Keys.CART_KEY) === null || getSavedItems(Keys.CART_KEY) === []) {
      saveItems(Keys.CART_KEY, [productData]);
    } else {
      let cartItems = getSavedItems(Keys.CART_KEY);
      const existItemIdx = cartItems.findIndex((product) => product._id === productData._id);

      existItemIdx === -1
        ? (cartItems = [...cartItems, productData])
        : (cartItems[existItemIdx].quantity += +amountInput.value);

      saveItems(Keys.CART_KEY, cartItems);
    }

    updateCartCount();

    (function applyCartMessage() {
      const cartMessage = document.querySelector(".cart-message");
      cartMessage.classList.add("fade-message");
      setTimeout(() => {
        cartMessage.classList.remove("fade-message");
      }, 1000);
    })();
  }

  function decreaseAmount() {
    if (amountInput.value > 1) {
      amountInput.value = +amountInput.value - 1;
      totalPrice.innerHTML = changeToKoreanWon(amountInput.value * price);
    }
  }

  function increaseAmount() {
    if (amountInput.value <= stock) {
      amountInput.value = +amountInput.value + 1;
      totalPrice.innerHTML = changeToKoreanWon(amountInput.value * price);
    }
  }
}

orderAndCart();
