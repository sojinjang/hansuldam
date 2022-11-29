import { get } from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";

const $ = (selector) => document.querySelector(selector);

async function initFunc() {
  await showEventCategories();

  const eventCategories = document.querySelectorAll(".event-wrapper");

  $(".menu-event-label").classList.add("clicked-label");

  eventCategories.forEach((container) => {
    container.addEventListener("click", async (e) => {
      if ($(".is-clicked")) {
        $(".is-clicked").classList.remove("is-clicked");
      }

      $(".events-container").style.marginBottom = "30px";

      const productContainer = document.querySelectorAll(".product-container");
      productContainer.forEach((container) => container.remove());

      const eventId = e.currentTarget.getAttribute("id");
      const eventProducts = await get(`${ApiUrl.CATEGORY}/${eventId}/products`);
      eventProducts["productList"].forEach((product) => renderData(product));

      e.target.classList.add("is-clicked");

      goToDetailPage();
    });
  });
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
