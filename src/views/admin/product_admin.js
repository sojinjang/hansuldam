import { get, post, patch, delete as del } from '../api.js';

const $ = (selector) => document.querySelector(selector);

async function initFuc() {
  $('.product-menu').addEventListener('click', () => {
    const productsContainer = document.querySelector('.products-container');
    const categoriesContainer = document.querySelector('.categories-container');
    const addCategoryModal = document.querySelector('.add-category-modal');
    const addProductModal = document.querySelector('.add-product-modal');

    if (productsContainer) { productsContainer.remove() };
    if (categoriesContainer) { categoriesContainer.remove(); };
    if (addProductModal) { addProductModal.remove() };
    if (addCategoryModal) { addCategoryModal.remove() };

    openProductMenu();
  });
}

async function openProductMenu() {
  const productsData = await get('/api/products');
  
  $('.product-menu').classList.add('isClicked');
  const productContainerHTML = `<section class="products-container">
  <button class="button add-button">추가</button>
  <button class="button close-button">닫기</button>
  <div class="columns title-container">
  <div class="column is-2 row-name">이름/브랜드</div>
  <div class="column is-2 row-price">가격/재고</div>
  <div class="column is-2 row-volumn">용량/설명</div>
  <div class="column is-2 row-category">카테고리/판매수</div>
  <div class="column is-2 row-type">타입/제조일자</div>
  <div class="column is-1 row-type">상세/도수</div>
  <div class="column is-1 row-type">삭제</div>
</div>
</section>`;

  await $('.admin-menu').insertAdjacentHTML('afterend', productContainerHTML);
  productsData.forEach(async (product, index) => {
    await renderProduct(product);
    if (index === productsData.length - 1) {
      renderProductDetail();
      deleteProduct();
    }
  });

  $('.close-button').addEventListener('click', closeSection);
  $('.add-button').addEventListener('click', addProduct);
}

function closeSection() {
  $('.product-menu').classList.remove('isClicked');
  $('.products-container').remove();
}

function addProduct() {
  $('.add-button').classList.add('none');
  $('.close-button').classList.add('none');

  const productModalHtml = `<label class="add-product-modal">
  <div class="left-modal">
    <input id="name" class="input is-rounded product-input" type="text" placeholder="이름" />
    <input id="price" class="input is-rounded product-input" type="number" placeholder="가격" />
    <input id="volume" class="input is-rounded product-input" type="number" placeholder="용량(ml)" />
    <input id="category" class="input is-rounded product-input" type="text" placeholder="카테고리" />
    <input id="image" class="input is-rounded product-input" type="text" placeholder="이미지" />
    <input id="brand" class="input is-rounded product-input" type="text" placeholder="브랜드명" />
  </div>
  <div class="right-modal">
    <input id="description" class="input is-rounded product-input" type="text" placeholder="설명" />
    <input id="stock" class="input is-rounded product-input" type="number" placeholder="재고" />
    <input id="sales" class="input is-rounded product-input" type="number" placeholder="판매량" />
    <input id="alcoholType" class="input is-rounded product-input" type="text" placeholder="종류(탁주)" />
    <input id="alcoholDegree" class="input is-rounded product-input" type="number" placeholder="도수" />
    <div>
      <button class="button add-product-button">추가</button>
      <button class="button close-modal-button">닫기</button>
    </div>
  </div>
</label>`;
  
  $('.admin-menu').insertAdjacentHTML('afterend', productModalHtml);
  $('.add-product-button').addEventListener('click', async () => {
    const productInput = [...document.querySelectorAll('.product-input')];
    const inputObj = productInput.reduce(
      (obj, input) => {
        obj[input.getAttribute('id')] = input.value;
        return obj;
      }, {});

    await post('/api/admin/products', inputObj);

    $('.add-product-modal').remove();
    $('.add-category-modal').remove();
    refreshData();
  });

  $('.close-modal-button').addEventListener('click', () => {
    $('.add-product-modal').remove();
    refreshData();
  });
}

async function renderProduct(product) {
  const { _id, name, price, volume, category, alcoholType } = await product;

  let productSection = document.createElement('div');

  productSection.setAttribute('class', 'columns items-container');
  productSection.setAttribute('id', _id);
  productSection.innerHTML = `<div class="column is-2 row-name">${name}</div>
<div class="column is-2 row-price">${price}</div>
<div class="column is-2 row-volumn">${volume}ml</div>
<div class="column is-2 row-category">${category}</div>
<div class="column is-2 row-type">${alcoholType}</div>
<div class="column is-1"><button id="${_id}" class="button column detail-button">상세</button></div>
<div class="column is-1"><button id="${_id}" class="button column delete-button">삭제</button></div>
`;

  $('.products-container').append(productSection);
}

async function renderProductDetail() {
  const productsData = await get('/api/products');
  const detailBtn = document.querySelectorAll('.detail-button');

  detailBtn.forEach((button) => {
    button.addEventListener('click', (e) => {
      let currentId = e.target.getAttribute('id');
      const currentIndex = productsData.findIndex(
        (product) => product._id === currentId
      );
      const currentData = productsData[currentIndex];
      const {
        _id,
        stock,
        brand,
        description,
        sales,
        manufacturedDate,
        alcoholDegree,
      } = currentData;

      const detailHtml = `<div class="columns items-container items-detail" id="cls${_id}">
      <div class="column is-2">${brand}</div>
      <div class="column is-2">${stock}</div>
      <div class="column is-2">${description}</div>
      <div class="column is-2">${sales}</div>
      <div class="column is-2">${manufacturedDate}</div>
      <div class="column is-1">${alcoholDegree}도</div>
      <div class="column is-1">
      <button class="button column">수정</button>
      </div>
      </div>`;

      if (e.target.innerHTML === '상세') {
        e.target.parentNode.parentNode.insertAdjacentHTML(
          'afterend',
          detailHtml
        );
        e.target.innerHTML = '닫기';
      } else {
        e.target.innerHTML = '상세';
        $(`#cls${_id}`).remove();
      }
    });
  });
}

function deleteProduct() {
  const deleteBtn = document.querySelectorAll('.delete-button');
  deleteBtn.forEach((button) => {
    button.addEventListener('click', (e) => {
      const currentId = e.target.getAttribute('id');
      e.target.setAttribute('class', 'button column is-danger delete-button-confirm');

      $('.delete-button-confirm').addEventListener('click', async () => {
        await del('/api/admin/products', currentId);
        refreshData();
      });
    });
  });
}

function refreshData() {
  $('.products-container').remove();
  openProductMenu();
}

export { initFuc as showProducts };
