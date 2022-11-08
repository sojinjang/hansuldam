const $ = (selector) => document.querySelector(selector);

async function fetchData() {
  const res = await fetch('/api/products/', {
    method: 'GET',
  });

  return await res.json();
}

async function showProducts() {
  let productsData = await fetchData();

  $('.product-menu').addEventListener('click', async () => {
    if ($('.categories-container')) $('.categories-container').remove();
    if (!$('.products-container')) {
      $('.product-menu').classList.add('isClicked');
      const productContainerHTML = `<section class="products-container">
      <button class="button close-button">닫기</button>
      <button class="button add-button">추가</button>
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
      productsData.forEach((product) => renderData(product));
      renderDetailData();
  
      $('.close-button').addEventListener('click', () => {
        $('.product-menu').classList.remove('isClicked');
        $('.products-container').remove();
      });
    }
  });
}

async function renderData(product) {
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
<div class="column is-1"><button id="del${_id}" class="button column delete-button">삭제</button></div>
`;

  $('.products-container').append(productSection);
}

async function renderDetailData() {
  const productsData = await fetchData();
  const detailBtn = document.querySelectorAll('.detail-button');
  const delBtn = document.querySelectorAll('.delete-button');

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
        manufacturedData,
        alcoholDegree,
      } = currentData;
      const detailHtml = `<div class="columns items-container items-detail" id="cls${_id}">
      <div class="column is-2">${brand}</div>
      <div class="column is-2">${stock}</div>
      <div class="column is-2">${description}</div>
      <div class="column is-2">${sales}</div>
      <div class="column is-2">${manufacturedData}</div>
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

export { showProducts };