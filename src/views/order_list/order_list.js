import { get, patch, delete as del } from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";
import { isName, isNum } from "../utils/validator.js";
import { findAddress } from "../utils/findAddress.js";

const $ = (selector) => document.querySelector(selector);
const selectId = (selector) => document.getElementById(selector);
const userData = await get(ApiUrl.USER_INFORMATION);
const orderId = userData.orders;

orderId.forEach((id) => {
  async function setOrderListContainer() {
    const orderList = await get(ApiUrl.ORDERS, id);
    const productList = await get(ApiUrl.ORDERS, `${id}/products`);

    createSingleOrderContainer(orderList).prepend(createOrderStatus(orderList));
    productList.forEach((product) => {
      selectId(`${orderList._id}-order-container`).append(createProductListContainer(product));
    });
    selectId(`${orderList._id}-order-container`).append(
      createShowDetailInformationButton(orderList)
    );
    selectId(`${orderList._id}-order-container`).append(
      createShippingDestinationContainer(orderList)
    );
    selectId(`${orderList._id}-order-container`).append(
      createChangeShippingDestinationContainer(orderList)
    );
    selectId(`${orderList._id}-order-container`).append(
      createPaymentInformationContainer(orderList)
    );
    selectId(`${orderList._id}-order-container`).append(
      createChangeInformationButtonContainer(orderList)
    );

    getDeliveryFee(orderList);
    getTotalPrice(orderList);

    selectId(`${orderList._id}-detail-info-btn`).addEventListener(
      "click",
      showDetailInformationPage
    );
    selectId(`${orderList._id}-info-change`).addEventListener(
      "click",
      showDeliveryInformationChangePage
    );
    selectId(`${orderList._id}-cancel-order`).addEventListener("click", cancelOrder);
    selectId(`${orderList._id}-change-btn`).addEventListener("click", setNewInformation);
    selectId(`${orderList._id}-cancel-btn`).addEventListener("click", cancelChangeInformation);
    selectId(`${orderList._id}-find-address-btn`).addEventListener(
      "click",
      insertFoundAddress
    );

    function showDetailInformationPage() {
      if (selectId(`${orderList._id}-address-container`).style.display == "none") {
        selectId(`${orderList._id}-address-container`).style.display = "flex";
        selectId(`${orderList._id}-payment-information-container`).style.display = "flex";
        if (orderList.status == "상품준비중") {
          selectId(`${orderList._id}-button-container`).style.display = "flex";
        }
      } else {
        selectId(`${orderList._id}-address-container`).style.display = "none";
        selectId(`${orderList._id}-payment-information-container`).style.display = "none";
        selectId(`${orderList._id}-button-container`).style.display = "none";
      }
    }

    function showDeliveryInformationChangePage() {
      selectId(`${orderList._id}-user-change-container`).style.display = "flex";
    }

    async function insertFoundAddress() {
      const { foundZoneCode, foundAddress } = await findAddress();
      selectId(`${orderList._id}-input-postalCode`).value = foundZoneCode;
      selectId(`${orderList._id}-input-address1`).value = foundAddress;
    }

    async function setNewInformation() {
      if (!isName(selectId(`${orderList._id}-input-name`).value)) {
        alert("이름 입력값을 확인해주세요 🪪");
        return;
      }
      if (selectId(`${orderList._id}-input-phoneNumber`).value.length < 11) {
        alert("휴대폰 번호를 다시 확인해주세요 📱");
        return;
      } else if (!isNum($(".phoneNumber-input").value)) {
        alert("숫자만 입력 가능합니다 🔢");
        return;
      }
      if (
        selectId(`${orderList._id}-input-postalCode`).value == "" ||
        selectId(`${orderList._id}-input-address1`).value == "" ||
        selectId(`${orderList._id}-input-address2`).value == ""
      ) {
        alert("주소를 기입해주세요 🏠");
        return;
      }

      const changeInfo = {
        fullName: selectId(`${orderList._id}-input-name`).value,
        phoneNumber: selectId(`${orderList._id}-input-phoneNumber`).value,
        address: {
          postalCode: selectId(`${orderList._id}-input-postalCode`).value,
          address1: selectId(`${orderList._id}-input-address1`).value,
          address2: selectId(`${orderList._id}-input-address2`).value,
        },
      };

      try {
        await patch("/api/orders", id, changeInfo);
        alert("정보가 수정되었습니다 🎉");
        selectId(`${orderList._id}-user-name`).innerHTML = selectId(
          `${orderList._id}-input-name`
        ).value;
        selectId(`${orderList._id}-user-phoneNumber`).innerHTML = selectId(
          `${orderList._id}-input-phoneNumber`
        ).value;
        selectId(`${orderList._id}-user-postalCode`).innerHTML = selectId(
          `${orderList._id}-input-postalCode`
        ).value;
        selectId(`${orderList._id}-user-address1`).innerHTML = selectId(
          `${orderList._id}-input-address1`
        ).value;
        selectId(`${orderList._id}-user-address2`).innerHTML = selectId(
          `${orderList._id}-input-address2`
        ).value;

        selectId(`${orderList._id}-user-change-container`).style.display = "none";
      } catch (e) {
        alert(e.message);
      }
    }

    function cancelChangeInformation() {
      selectId(`${orderList._id}-user-change-container`).style.display = "none";
    }

    async function cancelOrder() {
      try {
        if (confirm("주문을 취소하시겠습니까?")) {
          await del("/api/orders", id, productList);
          alert("주문취소가 성공적으로 처리되었습니다 😔");
          location.reload();
        }
      } catch (e) {
        alert(e.message);
      }
    }
  }
  setOrderListContainer();
});

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
  <div>
    <div class="order-date">
      <span class="orderDate">주문일자 <strong>${item.createdAt.substr(0, 10)}</strong></span>
      <span class="order-id">주문번호 <strong>${item._id}</strong></span>
    </div>
    
  </div>
  <span class="order-status">${item.status}</span>
</div>`;
  return Page;
}

function createProductListContainer(item) {
  const imageUrl = ".." + decodeURIComponent(item.image).split("views")[1];
  let product = undefined;
  product = document.createElement("div");
  product.setAttribute("class", "single-product-container");
  product.setAttribute("id", `${item._id}-single-product-container`);
  product.setAttribute("onclick", `window.location.href='/product-detail/?id=${item._id}'`);
  product.innerHTML = `<img src="${imageUrl}" alt="" />
  <div class="single-product-detail">
    <span class="single-product-name">${item.name}</span>
    <span class="single-product-price">${item.price.toLocaleString("ko-KR")}원</span>
    <span class="single-product-quantity">${item.quantity}개</span>
  </div>`;
  return product;
}

function createShowDetailInformationButton(item) {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "detail-info-button-container");
  page.setAttribute("id", `${item._id}-detail-info-button-container`);
  page.innerHTML = `<button class="detail-info-btn" id="${item._id}-detail-info-btn">주문상세정보∨</button>`;
  return page;
}

function createShippingDestinationContainer(item) {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "address-container");
  page.setAttribute("id", `${item._id}-address-container`);
  page.setAttribute("style", "display: none");
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
    <span class="user-address1" id="${item._id}-user-postalCode">${item.address.postalCode}</span>
    <span class="user-address1" id="${item._id}-user-address1">${item.address.address1}</span>
    <span class="user-address2" id="${item._id}-user-address2">${item.address.address2}</span>
  </div>
</div>
`;
  return page;
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
    <span class="payment-info-text">결제 상세</span>
    <div class="payment-method">
      <span>${item.payment.method}</span>
      <div>
        <span class="creditcard-information">${item.payment.detail}</span>
        <span class="creditcard-information">${item.payment.number.slice(
          0,
          4
        )}-****-*****-****</span>
      </div>
      <span class="pay-date">(${item.createdAt
        .slice(0, 16)
        .replace("T", " ")
        .replace("-", ".")
        .replace("-", ".")})</span>
    </div>
  </div>`;
  return page;
}

function createChangeShippingDestinationContainer(item) {
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
      placeholder="이름을 입력해주세요"
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
        id="${item._id}-input-postalCode"
        required
        placeholder="우편번호"
        autocomplete="on"
      />
      <input
        type="text"
        id="${item._id}-input-address1"
        required
        placeholder="주소를 입력해주세요"
        autocomplete="on"
      />
      <input
        type="text"
        id="${item._id}-input-address2"
        required
        placeholder="상세주소를 입력해주세요"
        autocomplete="on"
      />
    </div>
    <button class="button-38" id="${item._id}-find-address-btn">찾기</button>
  </div>
  <div class="address-btn-container" id="${item._id}-address-btn-container">
    <button class="change-btn button-38" id="${item._id}-change-btn">변경</button>
    <button class="cancel-btn button-38" id="${item._id}-cancel-btn">취소</button>
  </div>
</div>`;
  return page;
}

function createChangeInformationButtonContainer(item) {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "button-container");
  page.setAttribute("id", `${item._id}-button-container`);
  page.innerHTML = `<button class="info-change button-38" id="${item._id}-info-change">정보 수정하기</button>
  <button class="cancel-order button-38" id="${item._id}-cancel-order">주문 취소</button>`;
  return page;
}
