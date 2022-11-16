import * as api from "../api.js";
import { getCookieValue } from "../utils/cookie.js";
import { isName, isNum, isCardNum } from "../utils/validator.js";
import { getSavedItems } from "../utils/localStorage.js";
import { Keys } from "./constants/Keys.js";

const $ = (seletor) => document.querySelector(seletor);

function showProduct(item) {
  let product = undefined;
  product = document.createElement("div");
  product.setAttribute("class", "order-product");
  product.setAttribute("id", item._id);
  product.innerHTML = `<div class="thumbnail">
    <img class="product-img" src="../img/redmonkey.jpeg" />
    <div>
        <p class="product-brand">${item.brand}</p>
        <p class="product-name">${item.name}</p>
        <p class="product-volume">${item.volume}ml</p>
    </div>
    
</div>
<div class="product-info">
    <p class="product-quantity">${parseInt(item.quantity)}개</p>
    <p class="product-price">${(item.price * item.quantity).toLocaleString("ko-KR")}원</p>
</div>`;
  $(".add-product").append(product);
}

function getPureDigit(numStr) {
  const regex = /[^0-9]/g;
  return parseInt(numStr.replace(regex, ""));
}

function getAllProductsPrice() {
  const priceSelect = document.querySelectorAll(".product-price");
  let totalPrice = 0;
  let priceArr = [];
  for (let i = 0; i < priceSelect.length; i++) {
    priceArr.push(priceSelect.item(i).innerHTML);
  }
  priceArr.forEach((v) => {
    totalPrice += getPureDigit(v);
  });
  $(".total-product-price").innerText = `${totalPrice.toLocaleString("ko-KR")}원`;
  return totalPrice;
}

function getDeliveryFee(price) {
  const deliveryFee = price < 50000 ? (price > 0 ? 3000 : 0) : 0;
  $(".delivery-fee").innerText = `${deliveryFee.toLocaleString("ko-KR")}원`;
  return deliveryFee;
}

function caculateTotalPrice() {
  const productsPrice = getAllProductsPrice();
  const deliveryFee = getDeliveryFee(productsPrice);
  $(".total-payment-price").innerText = `${(productsPrice + deliveryFee).toLocaleString(
    "ko-KR"
  )}원`;
  return productsPrice + deliveryFee;
}

function showInput(e) {
  const type = e.target.value;
  if (type === "direct") {
    $("#input-hide").style.display = "flex";
  } else {
    $("#input-hide").style.display = "none";
  }
}

function showCardInfoForm(e) {
  e.preventDefault();
  $(".creditCard").style.display = "block";
}

function checkUserInfo() {
  if (!isName($(".user-name").value)) {
    alert("이름 입력값을 확인해주세요 🪪");
    return;
  }
  if (!isNum($(".user-phoneNumber").value)) {
    alert("전화번호는 숫자만 입력 가능합니다 📱");
    return;
  }
  return true;
}

function checkPayInfo() {
  if ($(".add-product").children.length === 0) {
    alert("주문 목록이 없습니다 🤔");
    return;
  }
  if ($("#card-select").value === "0") {
    alert("카드사를 선택해주세요 💳");
    return;
  }
  if (
    !isCardNum($(".creditCardInput1").value) ||
    !isCardNum($(".creditCardInput2").value) ||
    !isCardNum($(".creditCardInput3").value) ||
    !isCardNum($(".creditCardInput4").value)
  ) {
    alert("카드 번호 입력칸을 확인해주세요 🔢");
    return;
  }
  return true;
}

function makeProductsInOrder(items) {
  const productsArr = items.map((item) => ({
    id: item._id,
    quantity: item.quantity,
  }));
  return productsArr;
}

function makeOrderInfoObj() {
  return {
    fullName: $(".user-name").value,
    phoneNumber: $(".user-phoneNumber").value,
    address: {
      address1: $(".user-address1").value,
      address2: $(".user-address2").value,
    },
    payment: {
      method: "신용카드",
      detail: $(".card-company").options[$(".card-company").selectedIndex].value,
      number:
        $(".creditCardInput1").value +
        $(".creditCardInput2").value +
        $(".creditCardInput3").value +
        $(".creditCardInput4").value,
    },
    totalPrice: getPureDigit($(".total-payment-price").innerText),
    productsInOrder: makeProductsInOrder(savedProducts),
  };
}

async function requestPostOrder(orderInfoObj) {
  try {
    const orderObj = await api.post("/api/orders", orderInfoObj);
    window.location.href = `order_completed.html?${orderObj["_id"]}`;
  } catch (err) {
    alert(err.message);
  }
}

function sendPayInfo() {
  if (checkUserInfo() && checkPayInfo()) {
    const orderInfoObj = makeOrderInfoObj();
    requestPostOrder(orderInfoObj);
  }
}

if (!getCookieValue(Keys.IS_ADULT_KEY)) window.location.href = "/adult-certification";

let savedProducts = getSavedItems(Keys.PRODUCTS_KEY);
savedProducts.forEach(showProduct);
caculateTotalPrice();

$("#delivery-select").addEventListener("change", showInput);
$("#card-select").addEventListener("change", showInput);
$(".creditCardBtn").addEventListener("click", showCardInfoForm);

$(".pay-button").addEventListener("click", sendPayInfo);
