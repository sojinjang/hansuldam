import { get } from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";

const $ = (selector) => document.querySelector(selector);

async function initFunc() {
  await showEventCategories();

  const eventCategories = document.querySelectorAll(".event-wrapper");

  $(".menu-event-label").classList.add("clicked-label");

  eventCategories.forEach((container) => {
    container.addEventListener("click", async (e) => {
      const productContainer = document.querySelectorAll(".product-container");
      productContainer.forEach((container) => container.remove());

      const eventId = e.currentTarget.getAttribute("id");
      const eventProducts = await get(`${ApiUrl.CATEGORY}/${eventId}/products`);
      eventProducts["productList"].forEach((product) => renderData(product));

      goToDetailPage();
    });
  });
}

async function showEventCategories() {
  const eventCategoriesData = await get(ApiUrl.CATEGORY);

  eventCategoriesData.forEach((eventCategories) => {
    const { _id, name } = eventCategories;

    const eventCategoriesSection = document.createElement("span");
    eventCategoriesSection.setAttribute("class", "event-wrapper");
    eventCategoriesSection.setAttribute("id", _id);
    eventCategoriesSection.innerHTML = `${name}`;

    const eventsContainer = document.querySelector(".events-container");
    eventsContainer.append(eventCategoriesSection);
  });

  return eventCategoriesData;
}

function goToDetailPage() {
  const productContainer = document.querySelectorAll(".product-container");
  productContainer.forEach((container) => {
    container.addEventListener("click", (e) => {
      const productId = e.currentTarget.getAttribute("id");
      window.location.href = `/product-detail?id=${productId}`;
    });
  });
}

function renderData(product) {
  const { _id, name, brand, price, volume, sales, category, alcoholDegree } =
    product;

  let productSection = document.createElement("section");

  productSection.setAttribute("class", "product-container");
  productSection.setAttribute("id", _id);
  productSection.innerHTML = `<div class="product-image-wrapper">
  <img src="../img/ricewine_icon.png" alt="Product Image" />
</div>
<div class="product-content-container">
  <div class="content-title-wrapper">
    <p class="content-name">${name}</p>
  </div>
  <div class="content-container">
    <div class="content-left-container">
      <p class="content-brand">브랜드 | ${brand}</p>
      <p class="content-price">${Number(price).toLocaleString("ko-KR")}원</p>
      <p class="content-volume">${volume}ml</p>
    </div>
    <div class="content-right-container">
      <p class="content-sold">${sales}회 판매</p>
      <p class="content-category">${category}</p>
      <p class="content-alcoholDegree">${alcoholDegree}도</p>
    </div>
  </div>
</div>`;

  $(".body-container").append(productSection);
}

initFunc();
