import { get } from '../api.js';

const $ = (selector) => document.querySelector(selector);

async function refineData() {
  const fetchData = await get('/api/products');
  const productsData = fetchData['products'];

  const queryString = new Proxy(new URLSearchParams(window.location.search), {
    get: (params, prop) => params.get(prop),
  });

  const label = queryString.label;

  switch (label) {
    case 'totalProducts':
      return productsData;

    case 'newProducts':
      const sortNew = productsData.sort((a, b) => {
        if (a.updatedAt < b.updatedAt) return 1;
        if (a.updatedAt > b.updatedAt) return -1;
      });
      return sortNew;

    case 'bestProducts':
      const sortBestSelling = productsData.sort((a, b) => {
        if (a.sold < b.sold) return 1;
        if (a.sold > b.sold) return -1;
      });
      return sortBestSelling;
  }
}

async function showProducts() {
  let productsData = await refineData();

  if (!productsData) {
    alert('fetch한 데이터가 없습니다!');
  } else productsData.forEach((product) => renderData(product));

  const $ = (selector) => document.querySelector(selector);
  const queryString = new Proxy(new URLSearchParams(window.location.search), {
    get: (params, prop) => params.get(prop),
  });
  const label = queryString.label;

  switch (label) {
    case 'totalProducts':
      $('#totalProducts').setAttribute('class', 'menu-label clicked-label');
      break;

    case 'newProducts':
      $('#newProducts').setAttribute('class', 'menu-label clicked-label');
      break;

    case 'bestProducts':
      $('#bestProducts').setAttribute('class', 'menu-label clicked-label');
      break;
  }
}

async function goToDetailPage() {
  await showProducts();

  const productContainer = document.querySelectorAll('.product-container');
  productContainer.forEach((container) => {
    container.addEventListener('click', (e) => {
      const productId = e.currentTarget.getAttribute('id');
      window.location.href = `/product-detail?id=${productId}`;
    });
  });
}

function renderData(product) {
  const { _id, name, brand, price, volume, sales, category, alcoholDegree } =
    product;

  let productSection = document.createElement('section');

  productSection.setAttribute('class', 'product-container');
  productSection.setAttribute('id', _id);
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
      <p class="content-price">${Number(price).toLocaleString('ko-KR')}원</p>
      <p class="content-volume">${volume}ml</p>
    </div>
    <div class="content-right-container">
      <p class="content-sold">${sales}회 판매</p>
      <p class="content-category">${category}</p>
      <p class="content-alcoholDegree">${alcoholDegree}도</p>
    </div>
  </div>
</div>`;

  const bodyContainer = document.querySelector('.body-container');

  bodyContainer.append(productSection);
}

goToDetailPage();
