import { get } from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";

const $ = (selector) => document.querySelector(selector);

const params = new URLSearchParams(window.location.search);
const currentEvent = params.get("event");

async function initFunc() {
  await showEventCategories();

  const eventCategories = document.querySelectorAll(".event-wrapper");

  $(".menu-event-label").classList.add("clicked-label");

  eventCategories.forEach((container) => {
    container.addEventListener("click", async () => {
      const currentEventName = container.getAttribute("id");
      window.location.assign(`?event=${currentEventName}`);
    });
  });

  eventCategories.forEach((container) => {
    if (container.getAttribute("id") === currentEvent) {
      container.classList.add("is-clicked");
    }
  });

  (async function a() {
    $(".events-container").style.marginBottom = "30px";

    const eventProducts = await get(`${ApiUrl.CATEGORY}/${currentEvent}/products?perpage=20`);
    eventProducts["productList"].forEach((product) => renderData(product));

    goToDetailPage();
  })();
}

async function showEventCategories() {
  const eventCategoriesData = await get(ApiUrl.CATEGORY);

  eventCategoriesData.forEach((eventCategories, i) => {
    const { _id, name } = eventCategories;

    const eventCategoriesSection = document.createElement("span");

    eventCategoriesSection.setAttribute("class", "event-wrapper");
    eventCategoriesSection.setAttribute("id", _id);
    name === "없음"
      ? (eventCategoriesSection.innerHTML = `그 외`)
      : (eventCategoriesSection.innerHTML = `${name}`);

    const separatorHTML = `<span class="separator">|</span>`;
    const eventsContainer = document.querySelector(".events-container");

    eventsContainer.append(eventCategoriesSection);

    if (i < eventCategoriesData.length - 1) {
      eventsContainer.insertAdjacentHTML("beforeend", separatorHTML);
    }
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

async function renderData(product) {
  const { _id, name, brand, price, volume, alcoholDegree, image } = product;
  const imageUrl = "../" + decodeURIComponent(image).split("views")[1];

  let productSection = document.createElement("section");

  productSection.setAttribute("class", "product-container-wrapper");
  productSection.innerHTML = `<div class="product-container" id=${_id}>
  <div class="product-div-container">
    <div class="product-image-wrapper">
      <img src="${imageUrl}" alt="Product Image" />
    </div>
    <div class="product-content-container">
      <div class="content-title-wrapper">
        <p class="content-name">${name}</p>
      </div>
      <div class="content-container">
        <p class="content-price">${Number(price).toLocaleString("ko-KR")}원</p>
        <p class="content-brand">${brand}</p>
        <p class="content-alcoholDegree">${alcoholDegree}도</p>
        <p class="content-volume">${volume}ml</p>
      </div>
    </div>
  </div>
</div>`;

  const productsContainer = document.querySelector(".all-products-container");
  productsContainer.append(productSection);
  goToDetailPage();
}

initFunc();
