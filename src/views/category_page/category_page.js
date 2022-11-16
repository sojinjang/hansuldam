import { get } from "../api.js";
import { getCookieValue } from "../utils/cookie.js";
import { Keys } from "./constants/Keys.js";

const $ = (selector) => document.querySelector(selector);

async function fetchProducts(index) {
  const res = await fetch(`/api/products?page=${index}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookieValue(Keys.TOKEN)}`,
    },
  });
  const data = await res.json();

  return data;
}

const paginationHtml = `<nav class="pagination-container" role="navigation" aria-label="pagination">
<ul class="pagination-list">
  <li>
    <a class="pagination-link is-current" aria-label="1" aria-current="page">1</a>
  </li>
</ul>
</nav>`;

$(".footer-container").insertAdjacentHTML("beforebegin", paginationHtml);

let totalPage = 0;

async function refineData() {
  const fetchData = await get("/api/products");
  const pageOneProducts = fetchData["products"];
  let productsTotalData = pageOneProducts;

  totalPage = fetchData["totalPage"];

  for (let i = 2; i <= totalPage; i++) {
    let pageButton = document.createElement("li");
    pageButton.innerHTML = `<a class="pagination-link" aria-label="${i}" aria-current="page">${i}</a>`;
    $(".pagination-list").append(pageButton);
  }

  for (let i = 2; i <= totalPage; i++) {
    (await fetchProducts(i))["products"].forEach((product) => {
      productsTotalData.push(product);
    });
  }

  const queryString = new Proxy(new URLSearchParams(window.location.search), {
    get: (params, prop) => params.get(prop),
  });

  const label = queryString.label;

  switch (label) {
    case "totalProducts":
      document.title = "모든 상품 - 한술담 🍶";
      return productsTotalData;

    case "newProducts":
      document.title = "신상품 - 한술담 🍶";
      const sortNew = productsTotalData.sort((a, b) => {
        if (a.updatedAt < b.updatedAt) return 1;
        if (a.updatedAt > b.updatedAt) return -1;
      });
      return sortNew;

    case "bestProducts":
      document.title = "최고의 상품 - 한술담 🍶";
      const sortBestSelling = productsTotalData.sort((a, b) => {
        if (a.sales < b.sales) return 1;
        if (a.sales > b.sales) return -1;
      });
      return sortBestSelling;
  }
}

async function showProducts() {
  const productsTotalData = await refineData();

  let productsArr = [];

  for (let i = 0; i < productsTotalData.length; i += 9) {
    productsArr.push(productsTotalData.slice(i, i + 9));
  }
  let currentPageData = productsArr[0];

  currentPageData.forEach((product) => {
    renderData(product);
  });

  const paginationButton = document.querySelectorAll(".pagination-link");

  paginationButton.forEach((button) => {
    button.addEventListener("click", async (e) => {
      if (document.querySelectorAll(".product-container")) {
        const productContainers = document.querySelectorAll(".product-container");
        productContainers.forEach((container) => container.remove());
      }

      const pageButton = document.querySelectorAll(".pagination-link");
      const currentPage = e.target.getAttribute("aria-label");

      pageButton.forEach((button) => {
        button.classList.remove("is-current");
        window.scrollTo(0, 0);
      });
      e.target.classList.add("is-current");

      currentPageData = productsArr[currentPage - 1];

      if (!currentPageData) {
        alert("데이터가 없습니다!");
      } else
        currentPageData.forEach((product, index) => {
          renderData(product);
        });
    });
  });

  const queryString = new Proxy(new URLSearchParams(window.location.search), {
    get: (params, prop) => params.get(prop),
  });
  const label = queryString.label;

  switch (label) {
    case "totalProducts":
      $("#totalProducts").setAttribute("class", "menu-label clicked-label");
      break;

    case "newProducts":
      $("#newProducts").setAttribute("class", "menu-label clicked-label");
      break;

    case "bestProducts":
      $("#bestProducts").setAttribute("class", "menu-label clicked-label");
      break;
  }
}

await showProducts();

async function goToDetailPage() {
  const productContainer = document.querySelectorAll(".product-container");
  productContainer.forEach((container) => {
    container.addEventListener("click", (e) => {
      const productId = e.currentTarget.getAttribute("id");
      window.location.href = `/product-detail?id=${productId}`;
    });
  });
}

function renderData(product) {
  const { _id, name, brand, price, volume, sales, category, alcoholDegree } = product;

  let productSection = document.createElement("section");

  productSection.setAttribute("class", "product-container");
  productSection.setAttribute("id", _id);
  productSection.innerHTML = `<div class="product-div-container">
  <div class="product-image-wrapper">
    <img src="../img/ricewine_icon.png" alt="Product Image" />
  </div>
  <div class="product-content-container">
    <div class="content-title-wrapper">
      <p class="content-name">${name}</p>
    </div>
    <div class="content-container">
      <div class="content-left-container">
        <p class="content-price">${Number(price).toLocaleString("ko-KR")}원</p>
        <p class="content-brand">${brand}</p>
      </div>
      <div class="content-right-container">
        <p class="content-alcoholDegree">${alcoholDegree}도</p>
        <p class="content-volume">${volume}ml</p>
      </div>
    </div>
  </div>
</div>`;

  const bodyContainer = document.querySelector(".body-container");
  bodyContainer.append(productSection);
}

goToDetailPage();
