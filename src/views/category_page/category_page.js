async function fetchData() {
	const res = await fetch('http://localhost:8900/api/products', {	method: 'GET'	});
	
	return await res.json();
}

async function getData() {
	try {
		return await fetchData();
	} catch (error) {
		console.log(error);
	}
}

async function addContainer() {
	const data = await getData();
	const firstItem = document.querySelectorAll('.content__info');
	const tempContainer = document.querySelector('.add-container-here');
	const a = `					<div class="product-container">
					<div class="product-image-wrapper">
						<img src="../img/ricewine_icon.png" alt="" />
					</div>
					<div class="product-content-container">
						<div class="content__title__wrapper">
							<p class="content__info content__name">name</p>
						</div>
						<div class="content__container">
							<div class="content__left__container">
								<div class="content__brandName">
									<p class="content__info content__brand">brand</p>
								</div>
								<p class="content__info content__description">description</p>
								<p class="content__info content__price">price</p>
							</div>
							<div class="content__right__container">
								<p class="content__info content__sold">sold</p>
								<p class="content__info content__category">category</p>
								<p class="content__info content__alcoholDegree">alcoholDegree</p>
							</div>
						</div>
					</div>
				</div>
	`;
	
	for (i = 1; i < data.length; i++) {
		tempContainer.insertAdjacentHTML('beforeend', a);
	}
	
	const items = document.querySelectorAll('.content__info');
	
	let itemArr = [];
	let dataArr = [];
	
	firstItem.forEach((v, i) => {
		const value = v.className.split(' ')[1].split('content__')[1];
		itemArr[i] = value;
	});
	
	for (temp of data) {
		for (t of itemArr) {
			dataArr.push(temp[t]);
		}
	}
	
	items.forEach((v, i) => {
		v.innerHTML = dataArr[i];
	});
}
	
addContainer();