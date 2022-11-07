async function fetchData() {
  const res = await fetch('/api/products/', {
    method: 'GET',
  });

  try {
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function showProducts() {
  let productsData = await fetchData();

  productsData.forEach((product) => {
    const { _id, name, brand, price, volume, sales, category, alcoholDegree } = product;

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
      <p class="content-sold">${sales}회 판매</p>
      <p class="content-category">${category}</p>
      <p class="content-alcoholDegree">${alcoholDegree}도</p>
    </div>
  </div>
</div>`;

    const bodyContainer = document.querySelector('.body-container');
    
    bodyContainer.append(productSection);
  })
}

async function goToDetailPage() {
  await showProducts();

  const productContainer = document.querySelectorAll('.product-container');
  productContainer.forEach((container) => {
    container.addEventListener('click', (e) => {
      const productId = e.currentTarget.getAttribute('id');
      window.location.href = `/product-detail?id=${productId}`
    })
  })
}

goToDetailPage();