import { get, post, patch, delete as del } from '../api.js';
import removeContainer from './remove_container.js';

const $ = (selector) => document.querySelector(selector);

async function initFunc() {
  $('.product-menu').addEventListener('click', () => {
    removeContainer();
    openProductMenu();
  });
}

async function openProductMenu() {
  const fetchData = await get('/api/products');
  const productsData = fetchData['products'];

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
  if ($('.modify-product-modal')) {
    $('.modify-product-modal').remove();
  };
  
  if ($('.add-product-modal')) {
    $('.add-product-modal').remove();
  } 
  
  $('.product-menu').classList.remove('isClicked');
  $('.products-container').remove();
}

function addProduct() {
  if ($('.modify-product-modal')) {
    $('.modify-product-modal').remove();
  }

  if ($('.modify-product-modal')) {

  } 
  $('.add-button').classList.add('none');
  $('.close-button').classList.add('none');

  const productModalHtml = `<label class="add-product-modal">
<div class="left-modal">
  <input id="name" class="input is-rounded product-input" type="text" placeholder="이름" />
  <input id="price" class="input is-rounded product-input" type="number" placeholder="가격" />
  <input id="volume" class="input is-rounded product-input" type="number" placeholder="용량(ml)" />
  <input id="category" class="input is-rounded product-input" type="text" placeholder="카테고리" />
  <form action="/api/image" enctype="multipart/form-data" method="post">
    <div id="file-js-example" class="file has-name">
      <label class="file-label">
        <input
          id="image"
          class="file-input product-input"
          type="file"
          name="uploadImg"
          placeholder="이미지"
        />
        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-upload"></i>
          </span>
          <span class="file-label"></span>
        </span>
        <span class="file-name"> 이미지를 넣어주세요! </span>
        <button type="submit" class="button is-small img-upload-btn">전송</button>
      </label>
    </div>
  </form>
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
    const inputObj = productInput.reduce((obj, input) => {
      obj[input.getAttribute('id')] = input.value;
      return obj;
    }, {});

    try {
      await post('/api/admin/products', inputObj);
    } catch (e) {
      alert(e);
    }

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
<div class="column is-2 row-price">${Number(price).toLocaleString(
    'ko-KR'
  )}원</div>
<div class="column is-2 row-volumn">${volume}ml</div>
<div class="column is-2 row-category">${category}</div>
<div class="column is-2 row-type">${alcoholType}</div>
<div class="column is-1"><button id="${_id}" class="button column detail-button">상세</button></div>
<div class="column is-1"><button id="${_id}" class="button column delete-button">삭제</button></div>
`;

  $('.products-container').append(productSection);
}

async function renderProductDetail() {
  const fetchData = await get('/api/products');
  const productsData = fetchData['products'];
  const detailBtn = document.querySelectorAll('.detail-button');

  detailBtn.forEach((button) => {
    button.addEventListener('click', (e) => {
      const currentId = e.target.getAttribute('id');
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

      const detailHtml = `<div class="columns items-container items-detail opened" id="${_id}">
      <div class="column is-2">${brand}</div>
      <div class="column is-2">${stock}개 남음</div>
      <div class="column is-2">${description}</div>
      <div class="column is-2">${sales}개 판매</div>
      <div class="column is-2">${manufacturedDate}</div>
      <div class="column is-1">${alcoholDegree}도</div>
      <div class="column is-1">
      <button class="button column modify-button">수정</button>
      </div>
      </div>`;

      if (e.target.innerHTML === '상세') {
        if ($('.items-detail')) {
          $('.opened').remove();
        }
        e.target.parentNode.parentNode.insertAdjacentHTML(
          'afterend',
          detailHtml
        );
        e.target.innerHTML = '닫기';
      } else {
        e.target.innerHTML = '상세';
        $('.opened').remove();
      }

      const modifyBtn = document.querySelector('.modify-button');
      if (modifyBtn) {
        modifyBtn.addEventListener('click', () => {
          if ($('.add-product-modal')) { $('.add-product-modal').remove() }
          modifyProduct();
          window.scrollTo(0, 580);
        });
      }
    });
  });
}

function deleteProduct() {
  const deleteBtn = document.querySelectorAll('.delete-button');
  deleteBtn.forEach((button) => {
    button.addEventListener('click', (e) => {
      const currentId = e.target.getAttribute('id');
      e.target.setAttribute(
        'class',
        'button column is-danger delete-button-confirm'
      );

      $('.delete-button-confirm').addEventListener('click', async () => {
        await del('/api/admin/products', currentId);
        refreshData();
      });
    });
  });
}

function modifyProduct() {
  const productId = $('.opened').getAttribute('id');
  const productModalHtml = `<label class="modify-product-modal">
<div class="left-modal">
  <input id="name" class="input is-rounded product-input" type="text" placeholder="이름" />
  <input id="price" class="input is-rounded product-input" type="number" placeholder="가격" />
  <input id="volume" class="input is-rounded product-input" type="number" placeholder="용량(ml)" />
  <input id="category" class="input is-rounded product-input" type="text" placeholder="카테고리" />
  <form action="/api/image" enctype="multipart/form-data" method="post">
    <div id="file-js-example" class="file has-name">
      <label class="file-label">
        <input
          id="image"
          class="file-input product-input"
          type="file"
          name="uploadImg"
          placeholder="이미지"
        />
        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-upload"></i>
          </span>
          <span class="file-label"></span>
        </span>
        <span class="file-name"> 이미지를 넣어주세요! </span>
        <button type="submit" class="button is-small img-upload-btn">전송</button>
      </label>
    </div>
  </form>
  <input id="brand" class="input is-rounded product-input" type="text" placeholder="브랜드명" />
</div>
<div class="right-modal">
  <input id="description" class="input is-rounded product-input" type="text" placeholder="설명" />
  <input id="stock" class="input is-rounded product-input" type="number" placeholder="재고" />
  <input id="sales" class="input is-rounded product-input" type="number" placeholder="판매량" />
  <input id="alcoholType" class="input is-rounded product-input" type="text" placeholder="종류(탁주)" />
  <input id="alcoholDegree" class="input is-rounded product-input" type="number" placeholder="도수" />
  <div>
    <button class="button modify-product-button">수정</button>
    <button class="button close-modal-button">닫기</button>
  </div>
</div>
</label>`;

  $('.admin-menu').insertAdjacentHTML('afterend', productModalHtml);

  const fileInput = document.querySelector('#file-js-example input[type=file]');
  fileInput.onchange = () => {
    if (fileInput.files.length > 0) {
      const fileName = document.querySelector('#file-js-example .file-name');
      fileName.textContent = fileInput.files[0].name;
    }
  };

  $('.modify-product-button').addEventListener('click', async () => {
    const productInput = [...document.querySelectorAll('.product-input')];
    const inputObj = productInput.reduce((obj, input) => {
      obj[input.getAttribute('id')] = input.value;
      return obj;
    }, {});

    try {
      await patch('/api/admin/products', productId, inputObj);

      refreshData();
      $('.modify-product-modal').remove();
    } catch (e) {
      alert(e);
    }
  });
  $('.close-modal-button').addEventListener('click', () => {
    $('.modify-product-modal').remove();
    refreshData();
  });
}

function refreshData() {
  $('.products-container').remove();
  openProductMenu();
}

export { initFunc as showProducts };
