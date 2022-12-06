import { get } from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";

const $ = (selector) => document.querySelector(selector);

const params = new URLSearchParams(window.location.search);
const currentPage = params.get("page");
const currentlabel = params.get("label");

async function fetchProducts(index) {
  const data = await get(`${ApiUrl.PRODUCTS_OVERALL_INFORMATION}${index}&perpage=12`);

  return data;
}

async function refineData() {
  const { products, totalPage } = await fetchProducts(1);
  let productsTotalData = products;

  for (let i = 2; i <= totalPage; i++) {
    (await fetchProducts(i))["products"].forEach((product) => {
      productsTotalData.push(product);
    });
  }

  (function generatePagenationButton() {
    const paginationHtml = `<nav class="pagination-container" role="navigation" aria-label="pagination">
<ul class="pagination-list"></ul>
</nav>`;

    $(".footer-container").insertAdjacentHTML("beforebegin", paginationHtml);

    for (let i = 1; i <= totalPage; i++) {
      const pageButton = document.createElement("li");
      pageButton.innerHTML = `<a class="pagination-link button-35-white" aria-label="${i}" aria-current="page">${i}</a>`;
      $(".pagination-list").append(pageButton);
    }

    const paginationButton = document.querySelectorAll(".pagination-link");

    paginationButton.forEach((button) => {
      const currentButton = button.getAttribute("aria-label");

      if (currentButton === currentPage) {
        button.classList.add("button-35-brown");
      }
    });
  })();

  let refinedData = [];

  switch (currentlabel) {
    case "totalProducts":
      document.title = "모든 상품 - 한술담 🍶";
      refinedData = productsTotalData;
      break;

    case "newProducts":
      document.title = "신상품 - 한술담 🍶";
      const sortNew = productsTotalData.sort((a, b) => {
        if (a.updatedAt < b.updatedAt) return 1;
        if (a.updatedAt > b.updatedAt) return -1;
      });
      $(".pagination-list").remove();
      refinedData = sortNew.slice(0, 12);
      break;

    case "bestProducts":
      document.title = "최고의 상품 - 한술담 🍶";
      const sortBestSelling = productsTotalData.sort((a, b) => {
        if (a.sales < b.sales) return 1;
        if (a.sales > b.sales) return -1;
      });
      refinedData = sortBestSelling;
      break;
  }

  let slicedProductsTotalData = [];

  for (let i = 0; i < refinedData.length; i += 12) {
    slicedProductsTotalData.push(refinedData.slice(i, i + 12));
  }

  return slicedProductsTotalData;
}

async function showProducts() {
  const slicedProductsTotalData = await refineData();

  let currentPageData = slicedProductsTotalData[0];

  (function showProductsInPage() {
    currentPageData = slicedProductsTotalData[currentPage - 1];
    currentPageData.forEach((product) => {
      renderData(product);
    });
  })();

  (function handlePaginationButton() {
    const paginationButton = document.querySelectorAll(".pagination-link");

    paginationButton.forEach((button, i) => {
      button.addEventListener("click", () => {
        window.location.assign(`/products?label=${currentlabel}&page=${i + 1}`);
      });
    });
  })();

  (function addClickedClass() {
    switch (currentlabel) {
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
  })();
}

await showProducts();

async function renderData(product) {
  const { _id, name, brand, price, volume, alcoholDegree, image } = product;
  const imageUrl = "../" + decodeURIComponent(image).split("views")[1];

  let productSection = document.createElement("section");

  productSection.setAttribute("class", "product-container-wrapper");
  productSection.innerHTML = `<div class="product-container" id=${_id}>
  <div class="product-div-container">
    <div class="product-image-wrapper">
      <img src="${imageUrl}" alt="이런! 상품 이미지가 없네요." />
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

  const bodyContainer = document.querySelector(".body-container");
  bodyContainer.append(productSection);
  goToDetailPage();
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
