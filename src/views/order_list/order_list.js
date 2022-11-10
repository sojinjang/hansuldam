import { post, get, patch, delete as del } from "../api.js";

const $ = (selector) => document.querySelector(selector);
const selectId = (selector) => document.getElementById(selector);
const data = await get("/api/auth/user");
const orderId = data.orders;

orderId.forEach((id) => {
  async function setElement() {
    const orderList = await get("/api/orders/", id);
    const productList = await get("/api/orders/", `${id}/products`);

    showProductStatus(orderList);
    productList.forEach(showProductList);
    showUserInformation(orderList);
    showUserInformationChangeButton(orderList);
  }

  setElement();

  async function eventListenerBtn() {
    const orderList = await get("/api/orders/", id);
    const productList = await get("/api/orders/", `${id}/products`);

    if (orderList.status == "상품준비중") {
      selectId(`${orderList._id}-button-container`).style.display = "flex";
    }

    selectId(`${orderList._id}-info-change`).addEventListener(
      "click",
      clickChangeButton
    );
    selectId(`${orderList._id}-cancel-order`).addEventListener(
      "click",
      cancelOrder
    );
    selectId(`${orderList._id}-change-btn`).addEventListener(
      "click",
      setNewInformation
    );

    function clickChangeButton() {
      selectId(`${orderList._id}-change-wrapper`).style.display = "flex";
    }

    async function setNewInformation() {
      if (selectId(`${orderList._id}-input-name`).value.length < 2) {
        alert("이름을 다시 확인해주세요");
        return;
      }
      if (selectId(`${orderList._id}-input-phoneNumber`).value.length < 11) {
        alert("전화번호를 다시 확인해주세요");
        return;
      }
      if (
        selectId(`${orderList._id}-input-address1`).value == "" ||
        selectId(`${orderList._id}-input-address2`).value == ""
      ) {
        alert("주소를 다시 확인해주세요");
        return;
      }

      selectId(`${orderList._id}-user-name`).innerHTML = `수령인 : ${
        selectId(`${orderList._id}-input-name`).value
      }`;
      selectId(`${orderList._id}-user-phoneNumber`).innerHTML = `전화번호 : ${
        selectId(`${orderList._id}-input-phoneNumber`).value
      }`;
      selectId(`${orderList._id}-user-address1`).innerHTML = selectId(
        `${orderList._id}-input-address1`
      ).value;
      selectId(`${orderList._id}-user-address2`).innerHTML = selectId(
        `${orderList._id}-input-address2`
      ).value;

      const changeInfo = {
        fullName: selectId(`${orderList._id}-input-name`).value,
        phoneNumber: selectId(`${orderList._id}-input-phoneNumber`).value,
        address: {
          address1: selectId(`${orderList._id}-input-address1`).value,
          address2: selectId(`${orderList._id}-input-address2`).value,
        },
      };

      try {
        await patch("/api/orders", id, changeInfo);
        alert("정보가 수정되었습니다.");
        selectId(`${orderList._id}-change-wrapper`).style.display = "none";
      } catch (e) {
        alert("문제가 발생했습니다. 다시 시도해주세요.");
      }
    }

    async function cancelOrder() {
      try {
        await del("/api/orders", id, productList);
        alert("주문취소가 성공적으로 처리되었습니다.");
      } catch (e) {
        alert("문제가 발생했습니다. 다시 시도해주세요.");
      }
      // 주문 내역 요소 지우기
    }
  }

  eventListenerBtn();
});

function showProductStatus(item) {
  let product = undefined;
  product = document.createElement("span");
  product.setAttribute("class", "product-status");
  product.setAttribute("id", item._id);
  product.innerHTML = item.status;
  $(".order-detail").append(product);
}

function showProductList(item) {
  let product = undefined;
  product = document.createElement("div");
  product.setAttribute("class", "category-container");
  product.setAttribute("id", item._id);
  product.innerHTML = `<img src="../img/ricewine_icon.png" alt="" />
  <div class="category-detail">
    <span class="category-name">${item.product.name}</span>
    <span class="category-price">${(
      item.product.price * item.quantity
    ).toLocaleString("ko-KR")}원</span>
    <span class="category-quantity">${item.quantity}개</span>
  </div>`;
  $(".order-detail").append(product);
}

function showUserInformation(item) {
  let product = undefined;
  product = document.createElement("div");
  product.setAttribute("class", "address-container");
  product.setAttribute("id", item._id);
  product.innerHTML = `<div>
  <span class="user-name" id="${item._id}-user-name">수령인 : ${item.fullName}</span>
</div>
<div>
  <span class="user-phoneNumber" id="${item._id}-user-phoneNumber">전화번호 : ${item.phoneNumber}</span>
</div>
<div>
  <span class="user-address1" id="${item._id}-user-address1">${item.address.address1}</span>
</div>
<div>
  <span class="user-address2" id="${item._id}-user-address2">${item.address.address2}</span>
</div>`;
  $(".list-box").append(product);
}

function showUserInformationChangeButton(item) {
  let product = undefined;
  product = document.createElement("div");
  product.setAttribute("class", "user-change-container");
  product.setAttribute("id", `${item._id}-user-change-container`);
  product.innerHTML = `<div class="change-wrapper" id="${item._id}-change-wrapper">
  <div class="name-input-container">
    <span>수령인</span>
    <input
      type="text"
      id="${item._id}-input-name"
      required
      placeholder="이름"
      autocomplete="on"
    />
  </div>
  <div class="phoneNumber-input-container">
    <span>전화번호</span>
    <input
      id="${item._id}-input-phoneNumber"
      required
      placeholder="-을 빼고 입력해주세요"
      autocomplete="on"
    />
  </div>
  <div class="address-input-container">
    <span>주소</span>
    <div>
      <input
        type="text"
        id="${item._id}-input-address1"
        required
        placeholder="oo시 ㅇㅇ구 ㅇㅇ동"
        autocomplete="on"
      />
      <input
        type="text"
        id="${item._id}-input-address2"
        required
        placeholder="나머지 주소 입력"
        autocomplete="on"
      />
    </div>
  </div>
  <button class="change-btn" id="${item._id}-change-btn">변경하기</button>
</div>
<div class="button-container" id="${item._id}-button-container">
  <button class="info-change" id="${item._id}-info-change">정보 수정하기</button>
  <button class="cancel-order" id="${item._id}-cancel-order">주문 취소</button>
</div>`;
  $(".list-box").append(product);
}
