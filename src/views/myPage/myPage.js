import * as api from "../api.js";
import { getCookieValue, deleteCookie } from "../utils/cookie.js";
import { Keys } from "../constants/Keys.js";
import { ApiUrl } from "../constants/ApiUrl.js";

const $ = (selector) => document.querySelector(selector);
const selectId = (selector) => document.getElementById(selector);

const loginTOKEN = getCookieValue(Keys.TOKEN_KEY);

if (loginTOKEN !== undefined) {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "user-page-container");
  page.innerHTML = `<div class="body-section-container">
    <a href="/user-information"> 나의 정보 </a>
    <a href="/cart"> 장바구니 </a>
    <a href="/order-list"> 주문내역 </a>
    <a href="" class="delete-user"> 회원탈퇴 </a>
  </div>`;
  $(".body-container").append(page);

  $(".delete-user").addEventListener("click", deleteUserId);
}

async function deleteUserId(e) {
  e.preventDefault();
  try {
    await api.delete(ApiUrl.USER_INFORMATION);
    deleteCookie(Keys.TOKEN_KEY);
    alert("정보가 삭제되었습니다.");
    window.location.href = "/";
  } catch (e) {
    alert("문제가 발생했습니다. 다시 시도해주세요");
  }
}

if (loginTOKEN == undefined) {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "none-user-page-container");
  page.innerHTML = `<div class="none-user-page-input">
  <span>주문번호를 입력해주세요!</span>
  <input type="text" class="order-id" />
  <button class="check-order-btn">주문 조회하기</button>
</div>`;
  $(".body-container").append(page);

  $(".check-order-btn").addEventListener("click", showOrderListPage);
}

async function showOrderListPage() {
  const orderID = $(".order-id").value;

  if ($(".order-id").value == "") {
    alert("주문번호를 입력해주세요");
    return;
  }

  try {
    await api.get(ApiUrl.ORDERS, orderID);
  } catch {
    alert("일치하는 주문번호가 없습니다.");
  }

  const orderData = await api.get(ApiUrl.ORDERS, orderID);
  const productList = await api.get(ApiUrl.ORDERS, `${orderID}/products`);

  $(".none-user-page-input").style.display = "none";
  $(".none-user-page-container").style.display = "block";

  createOrderDateContainer(orderData);
  productList.forEach(createProductListContainer);
  createTotalBillContainer(orderData);
  createDeliveryInformationContainer(orderData);
  createChangeDeliveryInformationContainer();
  createButtonContainer();

  if ($("#order-status").innerHTML == "상품준비중") {
    $(".button-container").style.display = "flex";
  }

  async function eventListenerBtn() {
    $(".change-btn").addEventListener("click", clickChangeButton);
    $(".input-btn").addEventListener("click", setNewInformation);
    $(".cancel-btn").addEventListener("click", cancelOrder);

    function clickChangeButton() {
      $("#change-info-container").style.display = "flex";
    }

    async function setNewInformation() {
      if ($(".name-input").value.length < 2) {
        alert("이름을 다시 확인해주세요");
        return;
      }
      if ($(".phoneNumber-input").value.length < 11) {
        alert("전화번호를 다시 확인해주세요");
        return;
      }
      if (
        $(".address1-input").value == "" ||
        $(".address2-input").value == ""
      ) {
        alert("주소를 다시 확인해주세요");
        return;
      }

      const changeInfo = {
        fullName: $(".name-input").value,
        phoneNumber: $(".phoneNumber-input").value,
        address: {
          address1: $(".address1-input").value,
          address2: $(".address2-input").value,
        },
      };

      try {
        await api.patch(ApiUrl.ORDERS, orderID, changeInfo);
        alert("정보가 수정되었습니다.");
        $(".user-name").innerHTML = $(".name-input").value;
        $(".user-phoneNumber").innerHTML = $(".phoneNumber-input").value;
        $(".user-address1").innerHTML = $(".address1-input").value;
        $(".user-address2").innerHTML = $(".address2-input").value;
        $(".user-info-container").style.display = "none";
      } catch (e) {
        alert("문제가 발생했습니다. 다시 시도해주세요.");
      }
    }

    async function cancelOrder() {
      try {
        await api.delete("/api/orders", orderID);
        alert("주문취소가 성공적으로 처리되었습니다.");
        location.reload();
      } catch (e) {
        alert("문제가 발생했습니다. 다시 시도해주세요.");
      }
    }
  }
  eventListenerBtn();
}

function createOrderDateContainer(item) {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "order-list-container");
  page.innerHTML = `<div class="order-status">
  <div class="order-date">
    <span class="orderDate">${item.createdAt.substr(0, 10)}</span>
    <span>${item._id}</span>
  </div>
  <span id="order-status">${item.status}</span>
</div>`;
  $(".none-user-page-container").append(page);
}

function createProductListContainer(item) {
  let page = undefined;
  page = document.createElement("section");
  page.setAttribute("class", "order-lists");
  page.innerHTML = `<div class="single-product-container">
    <img src="../img/ricewine_icon.png" alt="" />
    <div class="single-product-detail">
      <span>${item.name}</span>
      <span>${item.quantity}개</span>
      <span>${item.price.toLocaleString("ko-KR")}원</span>
    </div>
  </div>`;
  $(".order-list-container").append(page);
}

function createDeliveryInformationContainer(item) {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "user-info-container");
  page.innerHTML = `<div>
  <span class="user-name" id="${item._id}-user-name">수령인  ${item.fullName}</span>
</div>
<div>
  <span class="user-phoneNumber" id="${item._id}-user-phoneNumber">전화번호  ${item.phoneNumber}</span>
</div>
<div class="user-address">
  <span class="user-address-container" id="${item._id}-user-address-container">주소</span>
  <div>
    <span class="user-address1" id="${item._id}-user-address1">${item.address.address1}</span>
    <span class="user-address2" id="${item._id}-user-address2">${item.address.address2}</span>
  </div>
</div>
<div class="user-credit-card">
  <span class="user-credit-card" id="${item._id}-user-credit-card">카드정보</span>
  <div class="credit-card">
    <span>${item.payment.detail}</span>
    <span>${item.payment.number}</span>
    <span></span>
  </div>
</div>`;
  $(".order-list-container").append(page);
}

function createChangeDeliveryInformationContainer() {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "user-info-container");
  page.setAttribute("id", "change-info-container");
  page.innerHTML = `<section>
  <div class="user-info-box">
    <div class="user-info" id="user-info-text">
      <span class="user-name">수령인</span>
      <span class="user-phoneNumber"
        >전화번호</span
      >
      <span class="user-phoneNumber"
        >주소</span
      >
    </div>
    <div class="user-info" id="change-info">
      <input type="text" class="name-input">
      <input type="text" class="phoneNumber-input">
      <input type="text" class="address1-input">
      <input type="text" class="address2-input">
    </div>
  </div>
  <button class="input-btn">수정</button>
</section>`;
  $(".order-list-container").append(page);
}

function createButtonContainer() {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "button-container");
  page.innerHTML = `<button class="change-btn">정보 수정하기</button>
  <button class="cancel-btn">주문 취소하기</button>`;
  $(".order-list-container").append(page);
}

function createTotalBillContainer(item) {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "bill-container");
  page.innerHTML = `<span>총 ${item.totalPrice.toLocaleString(
    "ko-KR"
  )}원</span>`;
  $(".order-list-container").append(page);
}
