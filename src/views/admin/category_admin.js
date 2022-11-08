const $ = (selector) => document.querySelector(selector);

async function fetchCategory() {
  const res = await fetch('/api/category/', {
    method: 'GET',
  });

  return await res.json();
}

async function showCategories() {
  let categoriesData = await fetchCategory();

  $('.category-menu').addEventListener('click', async () => {
    if ($('.products-container')) $('.products-container').remove();
    if (!$('.categories-container')) {
      $('.category-menu').classList.add('isClicked');
  
      const productContainerHTML = `<section class="categories-container">
  <button class="button close-button">닫기</button>
  <button class="button add-button">추가</button>
  <div class="columns title-container">
    <div class="column is-2 row-name">카테고리명</div>
    <div class="column is-2 row-products">항목</div>
  </div>
  </section>`;
  
      await $('.admin-menu').insertAdjacentHTML('afterend', productContainerHTML);
      categoriesData.forEach((category) => renderCategory(category));
      // renderDetailCategory();
  
      $('.close-button').addEventListener('click', closeSection);
      $('.add-button').addEventListener('click', addCategory);
    }
  });
}

async function renderCategory(category) {
  const { _id, name } = await category;
  // 카테고리 내 상품들. 나중에 스트링으로 바꾸어야 합니다.
  let { products } = await category;

  let categorySection = document.createElement('div');

  categorySection.setAttribute('class', 'columns items-container');
  categorySection.setAttribute('id', _id);
  categorySection.innerHTML = `<div class="column is-2 row-name">${name}</div>
<div class="column is-8 row-products">${products}</div>
<div class="column is-1"><button id="${_id}" class="button column detail-button">상세</button></div>
<div class="column is-1"><button id="del${_id}" class="button column delete-button">삭제</button></div>
`;

  $('.categories-container').append(categorySection);
}

function closeSection() {
  $('.category-menu').classList.remove('isClicked');
  $('.categories-container').remove();
}

function addCategory() {
  console.log('hi');
}

// async function renderDetailCategory() {
//   const productsData = await fetchData();
//   const detailBtn = document.querySelectorAll('.detail-button');
//   const delBtn = document.querySelectorAll('.delete-button');

//   detailBtn.forEach((button) => {
//     button.addEventListener('click', (e) => {
//       let currentId = e.target.getAttribute('id');
//       const currentIndex = productsData.findIndex(
//         (product) => product._id === currentId
//       );
//       const currentData = productsData[currentIndex];
//       const {
//         _id,
//         stock,
//         brand,
//         description,
//         sales,
//         manufacturedData,
//         alcoholDegree,
//       } = currentData;
//       const detailHtml = `<div class="columns items-container items-detail" id="cls${_id}">
//       <div class="column is-2">${stock}</div>
//       <div class="column is-2">${brand}</div>
//       <div class="column is-2">${description}</div>
//       <div class="column is-2">${sales}</div>
//       <div class="column is-2">${manufacturedData}</div>
//       <div class="column is-1">${alcoholDegree}</div>
//       <div class="column is-1">
//       <button class="button column">수정</button>
//       </div>
//       </div>`;

//       if (e.target.innerHTML === '상세') {
//         e.target.parentNode.parentNode.insertAdjacentHTML(
//           'afterend',
//           detailHtml
//         );
//         e.target.innerHTML = '닫기';
//       } else {
//         e.target.innerHTML = '상세';
//         $(`#cls${_id}`).remove();
//       }
//     });
//   });
// }

export { showCategories };