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
	let data = await fetchData();

	data.forEach((v, i) => {
		let product = document.createElement('div');
		product.setAttribute('class', 'product');
		product.classList.add(`product__num__${i}`);
		product.innerHTML = `					<div class="product-container">
					<div class="product-image-wrapper">
						<img src="../img/ricewine_icon.png" alt="" />
					</div>
					<div class="product-content-container">
						<div class="content__title__wrapper">
							<p class="content__info content__name">${data[i]['name']}</p>
						</div>
						<div class="content__container">
							<div class="content__left__container">
								<div class="content__brandName">
									<p class="content__info content__brand">${data[i]['brand']}</p>
								</div>
								<p class="content__info content__description">${data[i]['description']}</p>
								<p class="content__info content__price">price</p>
							</div>
							<div class="content__right__container">
								<p class="content__info content__sold">${data[i]['sold']}</p>
								<p class="content__info content__category">${data[i]['category']}</p>
								<p class="content__info content__alcoholDegree">${data[i]['alcoholDegree']}</p>
							</div>
						</div>
					</div>
				</div>`;

		const sectionContainer = document.querySelector('.section-container');	
		sectionContainer.append(product);
	});

	return data;
}

async function goToProduct() {
	const data = await showProducts();

	const productContainer = document.querySelectorAll('.product');
	const PRODUCTS_KEY = 'productId';

	productContainer.forEach(v => {
		v.addEventListener('click', (e) => {
			// 클릭한 항목의 번호 저장
			const currentDataIndex = e.currentTarget.classList[1].split('__')[2];
			const currentDataId = data[currentDataIndex]['_id'];
			
			localStorage.setItem(PRODUCTS_KEY, currentDataId);
			window.location.href = '/product_detail';
		})
	})
}

goToProduct();