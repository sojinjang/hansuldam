import * as api from "../api.js";
import { getCookieValue } from "../utils/cookie.js";
import { Keys } from "../constants/Keys.js";
import { ApiUrl } from "../constants/ApiUrl.js";
import { isName, isNum } from "../utils/validator.js";
import { findAddress } from "../utils/findAddress.js";

const $ = (selector) => document.querySelector(selector);
const selectId = (selector) => document.getElementById(selector);

const loginTOKEN = getCookieValue(Keys.TOKEN_KEY);

if (loginTOKEN !== undefined) {
  createUserPageContainer();
  createPasswordInputContainer();

  $(".user-profile-btn").addEventListener("click", showPasswordInputPage);
  $(".password-check-btn").addEventListener("click", checkUserPassword);
}

if (loginTOKEN == undefined) {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "none-user-page-container");
  page.innerHTML = `<div class="none-user-page-input">
  <span>비회원 주문조회</span>
  <p>비회원일 경우, 주문시의 주문번호로 주문조회가 가능합니다.</p>
  <input type="text" class="order-user-name" placeholder="이름을 입력하세요"/>
  <input type="text" class="order-id" placeholder="주문번호를 입력하세요"/>
  <button class="check-order-btn">주문 조회하기</button>
  <p>- 비회원 상품을 구매하신 경우에만 주문/배송 조회가 가능합니다.</p>
</div>`;
  $(".body-container").append(page);

  $(".check-order-btn").addEventListener("click", showOrderListPage);
}

async function showOrderListPage() {
  const orderID = $(".order-id").value;

  if (!isName($(".order-user-name").value)) {
    alert("이름을 입력해주세요 📛");
    return;
  }
  if ($(".order-id").value == "") {
    alert("주문번호를 입력해주세요 📛");
    return;
  }

  try {
    await api.get(ApiUrl.ORDERS, orderID);
  } catch {
    alert("일치하는 주문번호가 없습니다 😔");
  }

  const orderData = await api.get(ApiUrl.ORDERS, orderID);
  const productList = await api.get(ApiUrl.ORDERS, `${orderID}/products`);

  $(".none-user-page-input").style.display = "none";
  $(".none-user-page-container").style.display = "block";

  createOrderDateContainer(orderData);
  productList.forEach(createProductListContainer);
  createShowDetailInformationButton();
  createDeliveryInformationContainer(orderData);
  createChangeDeliveryInformationContainer();
  createPaymentInformationContainer(orderData);
  createButtonContainer();

  getDeliveryFee(orderData);
  getTotalPrice(orderData);

  $(".find-address-btn").addEventListener("click", insertFoundAddress);
  $(".info-change-btn").addEventListener("click", clickChangeButton);
  $(".change-btn").addEventListener("click", setNewInformation);
  $(".cancel-btn").addEventListener("click", cancelChangeInformation);
  $(".cancel-order-btn").addEventListener("click", cancelOrder);
  $(".detail-info-btn").addEventListener("click", showDetailInformationPage);

  function showDetailInformationPage() {
    if (($(".address-container").style.display = "none")) {
      $(".address-container").style.display = "flex";
      $(".payment-information-container").style.display = "flex";
      if (orderData.status == "상품준비중") {
        $(".button-container").style.display = "flex";
      }
    } else if (($(".address-container").style.display = "flex")) {
      $(".address-container").style.display = "none";
      $(".payment-information-container").style.display = "none";
      $(".button-container").style.display = "none";
    }
  }

  function clickChangeButton() {
    $("#change-info-container").style.display = "flex";
  }

  async function setNewInformation() {
    if (!isName($(".name-input").value)) {
      alert("이름을 다시 확인해주세요 📛");
      return;
    }
    if ($(".phoneNumber-input").value.length < 11) {
      alert("휴대폰 번호를 다시 확인해주세요 📱");
      return;
    } else if (!isNum($(".phoneNumber-input").value)) {
      alert("숫자만 입력 가능합니다 🔢");
      return;
    }

    if (
      $(".postalCode-input").value == "" ||
      $(".address1-input").value == "" ||
      $(".address2-input").value == ""
    ) {
      alert("주소를 기입해주세요 🏠");
      return;
    }

    const changeInfo = {
      fullName: $(".name-input").value,
      phoneNumber: $(".phoneNumber-input").value,
      address: {
        postalCode: $(".postalCode-input").value,
        address1: $(".address1-input").value,
        address2: $(".address2-input").value,
      },
    };

    try {
      await api.patch(ApiUrl.ORDERS, orderID, changeInfo);
      alert("정보가 성공적으로 수정되었습니다 🎉");
      $(".user-name").innerHTML = $(".name-input").value;
      $(".user-phoneNumber").innerHTML = $(".phoneNumber-input").value;
      $(".user-postalCode").innerHTML = $(".postalCode-input").value;
      $(".user-address1").innerHTML = $(".address1-input").value;
      $(".user-address2").innerHTML = $(".address2-input").value;
      $(".user-change-container").style.display = "none";
    } catch (e) {
      alert(e.message);
    }
  }

  function cancelChangeInformation() {
    $(".user-change-container").style.display = "none";
  }

  async function cancelOrder() {
    try {
      if (confirm("정말 취소하시겠습니까?")) {
        await api.delete("/api/orders", orderID);
        alert("주문이 취소되었습니다 😔");
        location.reload();
      }
    } catch (e) {
      alert(e.message);
    }
  }
}

async function checkUserPassword(e) {
  e.preventDefault();

  const userData = await api.get(ApiUrl.USER_INFORMATION);
  const userEmail = userData.email;
  const userInfo = {
    email: userEmail,
    password: $(".password-input").value,
  };

  try {
    await api.post(ApiUrl.LOGIN, userInfo);
    window.location = "/user-information";
  } catch (e) {
    alert(e.message);
  }
}

function showPasswordInputPage() {
  $(".password-container").style.display = "flex";
  $(".user-page-container").style.display = "none";
}

async function insertFoundAddress() {
  const { foundZoneCode, foundAddress } = await findAddress();
  $(".postalCode-input").value = foundZoneCode;
  $(".address1-input").value = foundAddress;
}

function getDeliveryFee(item) {
  const deliveryFee = item.totalPrice < 50000 ? (item.totalPrice > 0 ? 3000 : 0) : 0;
  selectId(`${item._id}-delivery-fee`).innerText = `(+) ${deliveryFee.toLocaleString(
    "ko-KR"
  )}원`;
  return deliveryFee;
}

function getTotalPrice(item) {
  const TotalProductsPrice = item.totalPrice;
  const deliveryFee = TotalProductsPrice < 50000 ? (TotalProductsPrice > 0 ? 3000 : 0) : 0;

  selectId(`${item._id}-total-pay`).innerHTML = `${(
    TotalProductsPrice + deliveryFee
  ).toLocaleString("ko-KR")}원`;
}

function createUserPageContainer() {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "user-page-container");
  page.innerHTML = `<div class="body-section-container">
    <div class="user-information-container">
      <span>내 정보</span>
      <button class="user-profile-btn">계정 정보 확인</button>
    </div>
    <div class="user-order-information-container">
      <span>쇼핑 정보</span>
      <a href="/order-list"> 주문내역 </a>
    </div>
  </div>`;
  $(".body-container").append(page);
}

function createPasswordInputContainer() {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "password-container");
  page.innerHTML = `
  <span>비밀번호 확인이 필요합니다</span>
  <input class="password-input" type="password" placeholder="비밀번호"/>
  <button class="password-check-btn">확인</button>
  `;
  $(".body-container").append(page);
}

function createOrderDateContainer(item) {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "order-list-container");
  page.innerHTML = `<div class="order-status">
  <div class="order-date">
    <span class="orderDate">주문날짜 <strong>${item.createdAt.substr(0, 10)}</strong></span>
    <span class="order-id">주문번호 <strong>${item._id}</strong></span>
  </div>
  <span id="order-status">${item.status}</span>
</div>`;
  $(".none-user-page-container").append(page);
}

function createProductListContainer(item) {
  let page = undefined;
  page = document.createElement("section");
  page.setAttribute("class", "order-lists");
  page.setAttribute("onclick", `window.location.href='/product-detail/?id=${item._id}'`);
  page.innerHTML = `<div class="single-product-container">
    <img src="../img/ricewine_icon.png" alt="" />
    <div class="single-product-detail">
      <span class="single-product-name">${item.name}</span>
      <span class="single-product-price">${item.price.toLocaleString("ko-KR")}원</span>
      <span class="single-product-quantity">${item.quantity}개</span>
    </div>
  </div>`;
  $(".order-list-container").append(page);
}

function createShowDetailInformationButton() {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "detail-info-button-container");
  page.setAttribute("id", `detail-info-button-container`);
  page.innerHTML = `<button class="detail-info-btn" id="detail-info-btn">주문상세정보∨</button>`;
  $(".order-list-container").append(page);
}

function createDeliveryInformationContainer(item) {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "address-container");
  page.innerHTML = `<div class="address-text">배송지 정보</div>
  <div class="address-info-wrapper">
    <span class="address-info-text">수령인</span>
    <span class="user-name" id="${item._id}-user-name">${item.fullName}</span>
  </div>
  <div class="address-info-wrapper">
    <span class="address-info-text">전화번호</span>
    <span class="user-phoneNumber" id="${item._id}-user-phoneNumber">${item.phoneNumber}</span>
  </div>
  <div class="address-info-wrapper">
    <span class="address-info-text" id="${item._id}-user-address-container">주소</span>
    <div>
      <span class="user-postalCode" id="${item._id}-user-postalCode">${item.address.postalCode}</span>
      <span class="user-address1" id="${item._id}-user-address1">${item.address.address1}</span>
      <span class="user-address2" id="${item._id}-user-address2">${item.address.address2}</span>
    </div>
  </div>`;
  $(".order-list-container").append(page);
}

function createPaymentInformationContainer(item) {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "payment-information-container");
  page.setAttribute("id", `${item._id}-payment-information-container`);
  page.innerHTML = `<div class="payment-text">결제정보</div>
  <div class="payment-wrapper">
    <span class="payment-info-text">상품 금액</span>
    <span class="products-pay">${item.totalPrice.toLocaleString("ko-KR")}원</span>
  </div>
  <div class="payment-wrapper">
    <span class="payment-info-text">배송비</span>
    <span class="delivery-fee" id="${item._id}-delivery-fee">[배송비]</span>
  </div>
  <div class="payment-wrapper">
    <span class="payment-info-text">결제 금액</span>
    <span class="total-pay" id="${item._id}-total-pay">[총 결제 금액]</span>
  </div>
  <div class="payment-wrapper" id="payment-method-wrapper">
    <span class="payment-info-text">결제 방법</span>
    <div class="payment-method">
      <span>${item.payment.method}</span>
      <div>
        <span class="creditcard-information">${item.payment.detail}</span>
        <span class="creditcard-information">${item.payment.number.slice(
          0,
          4
        )}-****-*****-****</span>
      </div>
    </div>
  </div>`;
  $(".order-list-container").append(page);
}

function createChangeDeliveryInformationContainer() {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "user-change-container");
  page.setAttribute("id", "change-info-container");
  page.innerHTML = `<div class="change-wrapper">
  <div class="name-input-container">
    <span>수령인</span>
    <input
      type="text"
      class="name-input"
      placeholder="이름"
      autocomplete="on"
      required
    />
  </div>
  <div class="phoneNumber-input-container">
    <span>전화번호</span>
    <input
      class="phoneNumber-input"
      placeholder="-을 빼고 입력해주세요"
      autocomplete="on"
      required
    />
  </div>
  <div class="address-input-container">
    <span>주소</span>
    <div>
      <input
        type="text"
        class="postalCode-input"
        placeholder="우편번호"
        autocomplete="on"
        required
      />
      <input
        type="text"
        class="address1-input"
        placeholder="주소"
        autocomplete="on"
        required
      />
      <input
        type="text"
        class="address2-input"
        placeholder="상세주소"
        autocomplete="on"
        required
      />
    </div>
    <button class="find-address-btn button-38">찾기</button>
  </div>
  <div class="address-btn-container">
    <button class="change-btn button-38">변경</button>
    <button class="cancel-btn button-38">취소</button>
  </div>
</div>`;
  $(".order-list-container").append(page);
}

function createButtonContainer() {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "button-container");
  page.innerHTML = `<button class="info-change-btn button-38">정보 수정하기</button>
  <button class="cancel-order-btn button-38">주문 취소하기</button>`;
  $(".order-list-container").append(page);
}
