import { get, patch, delete as del } from "../api.js";
import removeContainer from "./remove_container.js";
import { ApiUrl } from "../constants/ApiUrl.js";

const $ = (selector) => document.querySelector(selector);
let productsTotalData = [];

async function fetchProducts(index) {
  const data = await get(`${ApiUrl.PRODUCTS_OVERALL_INFORMATION}${index}&perpage=9`);

  return data;
}

function initFunc() {
  $(".order-menu").addEventListener("click", () => {
    removeContainer();
    openOrderMenu();
  });
}

async function openOrderMenu() {
  const ordersData = await get(ApiUrl.ADMIN_ORDERS);
  const { products, totalPage } = await fetchProducts(1);
  productsTotalData = products;

  for (let i = 2; i <= totalPage; i++) {
    (await fetchProducts(i))["products"].forEach((product) => {
      productsTotalData.push(product);
    });
  }

  $(".order-menu").classList.add("isClicked");

  const orderContainerHTML = `<section class="orders-container">
  <button class="button-35-white button close-button">닫기</button>
<div class="columns title-container">
  <div class="column is-2">이름</div>
  <div class="column is-2">주소</div>
  <div class="column is-2">주문날짜</div>
  <div class="column is-2">연락처</div>
  <div class="column is-2">주문상태/합계</div>
  <div class="column is-2">주문내용</div>
</div>
</section>`;

  await $(".admin-menu").insertAdjacentHTML("afterend", orderContainerHTML);

  ordersData.forEach(async (order, index) => {
    await renderOrder(order);
    if (index == ordersData.length - 1) {
      deleteOrder();
      changeStatus();
      renderOrderDetail();
    }
  });

  $(".close-button").addEventListener("click", closeSection);
}

function closeSection() {
  $(".order-menu").classList.remove("isClicked");
  $(".orders-container").remove();
}

async function renderOrder(order) {
  const {
    _id,
    fullName,
    address,
    totalPrice,
    productsInOrder,
    status,
    createdAt,
    phoneNumber,
  } = await order;
  const orderSection = document.createElement("div");

  orderSection.setAttribute("class", "columns items-container");
  orderSection.setAttribute("id", _id);
  orderSection.innerHTML = `<div class="column is-2">${fullName}</div>
<div class="column is-2">${address["address1"]}</div>
<div class="column is-2">${createdAt}</div>
<div class="column is-2">${phoneNumber}</div>
<div class="column is-2">
  <div>
    <select id="${_id}" class="button-35-white status-selector">
      <option
        value="상품준비중" 
        ${status === "상품준비중" ? "selected" : ""}>
        상품준비중
      </option>
      <option
        value="배송중" 
        ${status === "배송중" ? "selected" : ""}>
        배송중
      </option>
      <option
        value="배송완료" 
        ${status === "배송완료" ? "selected" : ""}>
        배송완료
      </option>
    </select>
  </div>
</div>
<div class="column is-1"><button id="${_id}" class="button-35-white button column detail-button">상세</button></div>
<div class="column is-1"><button id="${_id}" class="button-35-white button column delete-button">삭제</button></div>
`;

  $(".orders-container").append(orderSection);

  function orderDetail() {
    const orderObj = productsInOrder.reduce((arr, orderList) => {
      const currentProductIndex = productsTotalData.findIndex(
        (product) => product._id === orderList["id"]
      );

      if (currentProductIndex !== -1) {
        const obj = {
          name: productsTotalData[currentProductIndex]["name"],
          quantity: orderList["quantity"],
        };

        arr.push(obj);
      } else {
        const obj = {
          name: "이름이 뭘까요?",
          quantity: orderList["quantity"],
        };

        arr.push(obj);
      }

      return arr;
    }, []);

    const orderDetailDiv = document.createElement("div");
    orderDetailDiv.setAttribute("class", "columns items-container items-detail none");
    orderDetailDiv.setAttribute("id", `detail-${_id}`);

    let detailText = ``;
    orderObj.forEach((obj) => {
      detailText += `${obj.name} ${obj.quantity}개 <br />`;
    });

    orderDetailDiv.innerHTML = `<div class="column is-8">${detailText}</div>
    <div class="column is-2">총 ${Number(totalPrice).toLocaleString("ko-KR")}원</div>`;

    $(".orders-container").append(orderDetailDiv);
  }

  orderDetail();
}

function changeStatus() {
  const statusSelectors = document.querySelectorAll(`.status-selector`);
  statusSelectors.forEach((selector) => {
    selector.addEventListener("change", async () => {
      const currentId = selector.getAttribute("id");
      const newStatus = { status: selector.value };

      await patch(ApiUrl.ADMIN_ORDERS, currentId, newStatus);
    });
  });
}

function deleteOrder() {
  const deleteBtn = document.querySelectorAll(".delete-button");
  deleteBtn.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (e.target.id)
        if (!$(".is-danger")) {
          alert("삭제 하려면 다시 한 번 눌러주세요!");
        }

      const currentId = e.target.getAttribute("id");

      e.target.setAttribute("class", "button column is-danger delete-button-confirm");

      $(".delete-button-confirm").addEventListener("click", async () => {
        await del(ApiUrl.ADMIN_ORDERS, currentId);
        refreshData();
      });
    });
  });
}

async function renderOrderDetail() {
  const detailBtn = document.querySelectorAll(".detail-button");

  detailBtn.forEach((button) => {
    button.addEventListener("click", (e) => {
      const currentId = e.target.getAttribute("id");
      $(`#detail-${currentId}`).classList.toggle("none");

      if (
        $(`#detail-${currentId}`).getAttribute("class") ===
        "columns items-container items-detail none"
      ) {
        e.target.innerHTML = "상세";
      } else {
        e.target.innerHTML = "닫기";
      }
    });
  });
}

function refreshData() {
  $(".orders-container").remove();
  openOrderMenu();
}

export { initFunc as showOrders };
