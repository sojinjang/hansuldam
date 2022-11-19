import { get } from "../api.js";
import { changeToKoreanTime, changeToKoreanWon } from "../utils/useful_functions.js";
import { Keys } from "../constants/Keys.js";
import { getSavedItems, saveItems } from "../utils/localStorage.js";
import { ApiUrl } from "../constants/ApiUrl.js";

const $ = (selector) => document.querySelector(selector);

async function renderData() {
  const queryString = new Proxy(new URLSearchParams(window.location.search), {
    get: (params, prop) => params.get(prop),
  });
  const currentId = queryString.id;
  const fetchedData = await get(ApiUrl.PRODUCTS, currentId);
  const {
    _id,
    category,
    name,
    price,
    volume,
    description,
    alcoholType,
    alcoholDegree,
    manufacturedDate,
  } = fetchedData;

  document.title = `${name} - 한술담 🍶`;

  let productSection = document.createElement("section");

  productSection.setAttribute("class", "product-container");
  productSection.setAttribute("id", _id);
  productSection.innerHTML = `<div class="product-container">
  <div class="image-warpper">
    <img src="../img/ricewine_icon.png" alt="상품 이미지" />
  </div>
	<div class="content__container">
		<div class="content__main-info">
    <p class="content__item content__name">${name}</p>
    <p class="content__item content__category">${category}</p>
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
      <p class ="amount-container">
        <a class="amount-minus-button">-</a>
        <input value="1" type="number" class="amount-input" />
        <a class="amount-plus-button">+</a>
        <span class="amount-total-price">총 ${changeToKoreanWon(price)}원</span>
      </p>
		<div class="button-container">
			<button class="button is-info ml-2" id="order-button">
        바로 주문하기
			</button>
			<button class="button" id="basket-button">장바구니 담기</button>
			<p class="cart-message">
				장바구니에 담았습니다!
			</p>
		</div>
	</div>
</div>`;

  $(".body-container").append(productSection);

  return fetchedData;
}

async function orderAndCart() {
  let productData = await renderData();
  productData["quantity"] = 1;

  const { stock } = productData;
  const amountValue = document.querySelector(".amount-input");

  $("#order-button").addEventListener("click", moveToOrderPage);
  $("#basket-button").addEventListener("click", moveToCartPage);
  $(".amount-minus-button").addEventListener("click", decreaseAmount);
  $(".amount-plus-button").addEventListener("click", increaseAmount);

  function moveToOrderPage() {
    productData["quantity"] = +amountValue.value;
    saveItems(Keys.ORDER_KEY, [productData]);

    window.location.href = "/order-pay";
  }

  function moveToCartPage() {
    if (getSavedItems(Keys.CART_KEY) === null || getSavedItems(Keys.CART_KEY) === []) {
      saveItems(Keys.CART_KEY, [productData]);
    } else {
      let cartItems = getSavedItems(Keys.CART_KEY);
      const existItemIdx = cartItems.findIndex((product) => product._id === productData._id);

      if (existItemIdx === -1) {
        cartItems = [...cartItems, productData];
      } else {
        cartItems[existItemIdx].quantity += 1;
      }
      saveItems(Keys.CART_KEY, cartItems);
    }

    (function applyCartMessage() {
      const cartMessage = document.querySelector(".cart-message");
      cartMessage.classList.add("fade-message");
      setTimeout(() => {
        cartMessage.classList.remove("fade-message");
      }, 1000);
    })();
  }

  function decreaseAmount() {
    if (amountValue.value != 0) {
      amountValue.value = +amountValue.value - 1;
    }
  }

  function increaseAmount() {
    if (amountValue.value <= stock) {
      amountValue.value = +amountValue.value + 1;
    }
  }
}

orderAndCart();
