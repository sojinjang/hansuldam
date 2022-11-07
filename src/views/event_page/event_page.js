async function fetchCategoryData() {
  const res = await fetch('http://localhost:8900/api/category', {
    method: 'GET',
  });

  return await res.json();
}

async function showEventCategories() {
  let eventCategoriesData = await fetchCategoryData();

  eventCategoriesData.forEach((eventCategories) => {
    const { _id, name } = eventCategories;

    let eventCategoriesSection = document.createElement('span');
    eventCategoriesSection.setAttribute('class', 'event-wrapper');
    eventCategoriesSection.setAttribute('id', _id);
    eventCategoriesSection.innerHTML = `${name}`;

    const eventsContainer = document.querySelector('.events-container');
    eventsContainer.append(eventCategoriesSection);
  });
}

async function goToEvent() {
  await showEventCategories();

  const eventCategories = document.querySelectorAll('.event-wrapper');
  
  eventCategories.forEach((container) => {
    container.addEventListener('click', async (e) => {
      // 기존 아이템들 삭제하기
      const productContainer = document.querySelectorAll('.product-container');
      productContainer.forEach((container) => container.remove());

      const eventId = e.currentTarget.getAttribute('id');
      const res = await fetch(
        `http://localhost:8900/api/category/${eventId}/products`
        )
      const eventProducts = await res.json();
        
      eventProducts.forEach((product) => renderData(product));
      })
  })
}

async function goToDetailPage() {
  await goToEvent();

  const productContainer = document.querySelectorAll('.product-container');
  productContainer.forEach((container) => {
    container.addEventListener('click', (e) => {
      const productId = e.currentTarget.getAttribute('id');
      window.location.href = `/product-detail?id=${productId}`;
    });
  });
};

function renderData(product) {
  const { _id, name, brand, price, volume, sold, category, alcoholDegree } = product;

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
      <p class="content-price">${price}원</p>
      <p class="content-volume">${volume}ml</p>
    </div>
    <div class="content-right-container">
      <p class="content-sold">${sold}회 판매</p>
      <p class="content-category">${category}</p>
      <p class="content-alcoholDegree">${alcoholDegree}도</p>
    </div>
  </div>
</div>`;

  const bodyContainer = document.querySelector('.body-container');
  
  bodyContainer.append(productSection);
}

goToDetailPage();