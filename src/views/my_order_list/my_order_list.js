import { get, patch, delete as del } from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";
import { isName, isNum } from "../utils/validator.js";
import { findAddress } from "../utils/findAddress.js";

const $ = (selector) => document.querySelector(selector);
const selectId = (selector) => document.getElementById(selector);
const userData = await get(ApiUrl.USER_INFORMATION);
const orderId = userData.orders;

async function setOrderListContainer(orderId) {
  for await (const id of orderId) {
    try {
      const orderList = await get(ApiUrl.ORDERS, id);
      const productList = await get(ApiUrl.ORDERS, `${id}/products`);

      createSingleOrderContainer(orderList).append(createOrderStatus(orderList));
      productList.forEach((product) => {
        selectId(`${orderList._id}-order-container`).append(
          createProductListContainer(product)
        );
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

      getDeliveryFee(orderList, productList);
      getTotalPrice(orderList, productList);
      getUserInformation(orderList);

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
      selectId(`${orderList._id}-cancel-btn`).addEventListener(
        "click",
        cancelChangeInformation
      );
      selectId(`${orderList._id}-find-address-btn`).addEventListener(
        "click",
        insertFoundAddress
      );

      function showDetailInformationPage() {
        if (selectId(`${orderList._id}-address-container`).style.display == "none") {
          selectId(`${orderList._id}-address-container`).style.display = "flex";
          selectId(`${orderList._id}-payment-information-container`).style.display = "flex";
          if (orderList.status == "???????????????") {
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
          alert("?????? ???????????? ?????????????????? ????");
          return;
        }
        if (selectId(`${orderList._id}-input-phoneNumber`).value.length < 11) {
          alert("????????? ????????? ?????? ?????????????????? ????");
          return;
        } else if (!isNum(selectId(`${orderList._id}-input-phoneNumber`).value)) {
          alert("????????? ?????? ??????????????? ????");
          return;
        }
        if (
          selectId(`${orderList._id}-input-postalCode`).value == "" ||
          selectId(`${orderList._id}-input-address1`).value == "" ||
          selectId(`${orderList._id}-input-address2`).value == ""
        ) {
          alert("????????? ?????????????????? ????");
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
          alert("????????? ????????????????????? ????");
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
          if (confirm("????????? ?????????????????????????")) {
            await del("/api/orders", id, productList);
            alert("??????????????? ??????????????? ????????????????????? ????");
            location.reload();
          }
        } catch (e) {
          alert(e.message);
        }
      }
    } catch (e) {
      alert(e.message);
    }
  }
}

setOrderListContainer(orderId);

function getDeliveryFee(list, item) {
  const deliveryFee = getTotalPrice(list, item) < 50000 ? (list.totalPrice > 0 ? 3000 : 0) : 0;
  selectId(`${list._id}-delivery-fee`).innerText = `(+) ${deliveryFee.toLocaleString(
    "ko-KR"
  )}???`;
  return deliveryFee;
}

function getTotalPrice(list, item) {
  const TotalProductsList = list.productsInOrder;
  let TotalPrice = 0;
  const productsQuantity = [];

  TotalProductsList.forEach((product) => {
    productsQuantity.push(product.quantity);
  });

  item.forEach((product, index) => {
    TotalPrice += product.price * productsQuantity[index];
  });

  selectId(`${list._id}-products-pay`).innerHTML = `${TotalPrice.toLocaleString("ko-KR")}???`;

  return TotalPrice;
}

function getUserInformation(info) {
  selectId(`${info._id}-input-name`).value = info.fullName;
  selectId(`${info._id}-input-phoneNumber`).value = info.phoneNumber;
  selectId(`${info._id}-input-postalCode`).value = info.address.postalCode;
  selectId(`${info._id}-input-address1`).value = info.address.address1;
  selectId(`${info._id}-input-address2`).value = info.address.address2;
}

function createSingleOrderContainer(item = "") {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "order-container");
  page.setAttribute("id", `${item._id}-order-container`);
  $(".body-container").prepend(page);
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
      <span class="orderDate">???????????? <strong>${item.createdAt.substr(0, 10)}</strong></span>
      <span class="order-id">???????????? <strong>${item._id}</strong></span>
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
    <span class="single-product-price">${item.price.toLocaleString("ko-KR")}???</span>
    <span class="single-product-quantity">${item.quantity}???</span>
  </div>`;
  return product;
}

function createShowDetailInformationButton(item) {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "detail-info-button-container");
  page.setAttribute("id", `${item._id}-detail-info-button-container`);
  page.innerHTML = `<button class="detail-info-btn" id="${item._id}-detail-info-btn">?????????????????????</button>`;
  return page;
}

function createShippingDestinationContainer(item) {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "address-container");
  page.setAttribute("id", `${item._id}-address-container`);
  page.setAttribute("style", "display: none");
  page.innerHTML = `<div class="address-text">????????? ??????</div>
<div class="address-info-wrapper">
  <span class="address-info-text">?????????</span>
  <span class="user-name" id="${item._id}-user-name">${item.fullName}</span>
</div>
<div class="address-info-wrapper">
  <span class="address-info-text">????????????</span>
  <span class="user-phoneNumber" id="${item._id}-user-phoneNumber">${item.phoneNumber}</span>
</div>
<div class="address-info-wrapper">
  <span class="address-info-text" id="${item._id}-user-address-container">??????</span>
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
  page.innerHTML = `<div class="payment-text">????????????</div>
  <div class="payment-wrapper">
    <span class="payment-info-text">?????? ??????</span>
    <span class="products-pay" id="${item._id}-products-pay">[??? ?????? ??????]</span>
  </div>
  <div class="payment-wrapper">
    <span class="payment-info-text">?????????</span>
    <span class="delivery-fee" id="${item._id}-delivery-fee">[?????????]</span>
  </div>
  <div class="payment-wrapper">
    <span class="payment-info-text">?????? ??????</span>
    <span class="total-pay" id="${item._id}-total-pay">${item.totalPrice.toLocaleString(
    "ko-KR"
  )}???</span>
  </div>
  <div class="payment-wrapper" id="payment-method-wrapper">
    <span class="payment-info-text">?????? ??????</span>
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
    <span>?????????</span>
    <input
      type="text"
      id="${item._id}-input-name"
      required
      placeholder="????????? ??????????????????"
      autocomplete="on"
    />
  </div>
  <div class="phoneNumber-input-container">
    <span>????????????</span>
    <input
      id="${item._id}-input-phoneNumber"
      required
      placeholder="-??? ?????? ??????????????????"
      autocomplete="on"
    />
  </div>
  <div class="address-input-container">
    <span>??????</span>
    <div>
      <input
        type="text"
        id="${item._id}-input-postalCode"
        required
        placeholder="????????????"
        autocomplete="on"
      />
      <input
        type="text"
        id="${item._id}-input-address1"
        required
        placeholder="????????? ??????????????????"
        autocomplete="on"
      />
      <input
        type="text"
        id="${item._id}-input-address2"
        required
        placeholder="??????????????? ??????????????????"
        autocomplete="on"
      />
    </div>
    <button class="button-38" id="${item._id}-find-address-btn">????????????</button>
  </div>
  <div class="address-btn-container" id="${item._id}-address-btn-container">
    <button class="change-btn button-38" id="${item._id}-change-btn">??????</button>
    <button class="cancel-btn button-38" id="${item._id}-cancel-btn">??????</button>
  </div>
</div>`;
  return page;
}

function createChangeInformationButtonContainer(item) {
  let page = undefined;
  page = document.createElement("div");
  page.setAttribute("class", "button-container");
  page.setAttribute("id", `${item._id}-button-container`);
  page.innerHTML = `<button class="info-change" id="${item._id}-info-change">?????? ????????????</button>
  <button class="cancel-order" id="${item._id}-cancel-order">?????? ??????</button>`;
  return page;
}
