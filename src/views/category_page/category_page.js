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

  productsData.forEach((v, i) => {
    let productContainer = document.createElement('div');
    productContainer.setAttribute('class', 'product');
    productContainer.classList.add(`product__num__${i}`);
    productContainer.innerHTML = `					<div class="product-container">
					<div class="product-image-wrapper">
						<img src="../img/ricewine_icon.png" alt="Product Image" />
					</div>
					<div class="product-content-container">
						<div class="content__title__wrapper">
							<p class="content__info content__name">${productsData[i]['name']}</p>
						</div>
						<div class="content__container">
							<div class="content__left__container">
								<div class="content__brandName">
									<p class="content__info content__brand">${productsData[i]['brand']}</p>
								</div>
								<p class="content__info content__description">${productsData[i]['description']}</p>
								<p class="content__info content__price">price</p>
							</div>
							<div class="content__right__container">
								<p class="content__info content__sold">${productsData[i]['sold']}</p>
								<p class="content__info content__category">${productsData[i]['category']}</p>
								<p class="content__info content__alcoholDegree">${productsData[i]['alcoholDegree']}</p>
							</div>
						</div>
					</div>
				</div>`;

    const sectionContainer = document.querySelector('.section-container');
    sectionContainer.append(productContainer);
  });

  return productsData;
}

async function goToProduct() {
  const data = await showProducts();

  const productContainer = document.querySelectorAll('.product');
  const PRODUCTS_KEY = 'productId';

  productContainer.forEach((v) => {
    v.addEventListener('click', (e) => {
      // 클릭한 항목의 번호 저장
      const currentDataIndex = e.currentTarget.classList[1].split('__')[2];
      const currentDataId = data[currentDataIndex]['_id'];

      localStorage.setItem(PRODUCTS_KEY, currentDataId);
      window.location.href = '/product-detail';
    });
  });
}

goToProduct();
