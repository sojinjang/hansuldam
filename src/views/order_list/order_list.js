import { post, get, patch, delete as del } from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";

const $ = (selector) => document.querySelector(selector);
const selectId = (selector) => document.getElementById(selector);
const userData = await get(ApiUrl.USER_INFORMATION);
const orderId = userData.orders;

orderId.forEach((id) => {
  async function setOrderListContainer() {
    const orderList = await get(ApiUrl.ORDERS, id);
    const productList = await get(ApiUrl.ORDERS, `${id}/products`);

    createSingleOrderContainer(orderList).append(createOrderStatus(orderList));
    productList.forEach((product) => {
      selectId(`${orderList._id}-order-container`).append(
        createProductListContainer(product)
      );
    });
    selectId(`${orderList._id}-order-container`).append(
      createTotalBillContainer(orderList)
    );
    selectId(`${orderList._id}-order-container`).append(
      createDeliveryInformaionContainer(orderList)
    );
    selectId(`${orderList._id}-order-container`).append(
      createDeliveryInformationChangeContainer(orderList)
    );
    selectId(`${orderList._id}-order-container`).append(
      createChangeButtonContainer(orderList)
    );

    if (orderList.status == "상품준비중") {
      selectId(`${orderList._id}-button-container`).style.display = "flex";
    }

    selectId(`${orderList._id}-info-change`).addEventListener(
      "click",
      showDeliveryInformationChangePage
    );
    selectId(`${orderList._id}-cancel-order`).addEventListener(
      "click",
      cancelOrder
    );
    selectId(`${orderList._id}-change-btn`).addEventListener(
      "click",
      setNewInformation
    );

    function showDeliveryInformationChangePage() {
      selectId(`${orderList._id}-user-change-container`).style.display = "flex";
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

        selectId(`${orderList._id}-user-change-container`).style.display =
          "none";
      } catch (e) {
        alert("문제가 발생했습니다. 다시 시도해주세요.");
      }
    }

    async function cancelOrder() {
      try {
        await del("/api/orders", id, productList);
        alert("주문취소가 성공적으로 처리되었습니다.");
        location.reload();
      } catch (e) {
        alert("문제가 발생했습니다. 다시 시도해주세요.");
      }
    }
  }
  setOrderListContainer();
});

function createSingleOrderContainer(item = "") {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "order-container");
  page.setAttribute("id", `${item._id}-order-container`);
  $(".body-container").append(page);
  return page;
}

function createOrderStatus(item) {
  let Page = undefined;
  Page = document.createElement("div");
  Page.setAttribute("class", "order-list-container");
  Page.setAttribute("id", item._id);
  Page.innerHTML = `<div class="order-status">
  <div class="order-date">
    <span class="orderDate">총 ${item.createdAt.substr(0, 10)}</span>
    <span>${item._id}</span>
  </div>
  <span class="order-status">${item.status}</span>
</div>`;
  return Page;
}

function createProductListContainer(item) {
  let product = undefined;
  product = document.createElement("div");
  product.setAttribute("class", "single-product-container");
  product.setAttribute("id", item._id);
  product.innerHTML = `<img src="../img/ricewine_icon.png" alt="" />
  <div class="single-product-detail">
    <span class="single-product-name">${item.name}</span>
    <span class="single-product-price">${(
      item.price * item.quantity
    ).toLocaleString("ko-KR")}원</span>
    <span class="single-product-quantity">${item.quantity}개</span>
  </div>`;
  return product;
}

function createTotalBillContainer(item) {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "bill-container");
  page.setAttribute("id", `${item._id}-bill-container`);
  page.innerHTML = `<span>총 ${item.totalPrice.toLocaleString(
    "ko-KR"
  )}원</span>`;
  return page;
}

function createDeliveryInformaionContainer(item) {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "address-container");
  page.setAttribute("id", item._id);
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
  return page;
}

function createDeliveryInformationChangeContainer(item) {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "user-change-container");
  page.setAttribute("id", `${item._id}-user-change-container`);
  page.innerHTML = `<div class="change-wrapper" id="${item._id}-change-wrapper">
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
</div>`;
  return page;
}

function createChangeButtonContainer(item) {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "button-container");
  page.setAttribute("id", `${item._id}-button-container`);
  page.innerHTML = `<button class="info-change" id="${item._id}-info-change">정보 수정하기</button>
  <button class="cancel-order" id="${item._id}-cancel-order">주문 취소</button>`;
  return page;
}
