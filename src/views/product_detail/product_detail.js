async function fetchData() {
	// 임시 데이터 입니다.
	const res = await fetch(
		'http://localhost:8900/api/products/63610adac317f1d02531d3a5',
		{
			method: 'GET',
		}
	);

	return await res.json();
}

async function getData() {
	try {
		data = await fetchData();

		items.forEach((v, i) => {
			const value = items[i].className.split(' ')[1].split('content__')[1];

			if (data[value]) {
				v.innerHTML = data[value];
			} else {
				v.innerHTML =
					'정보가 없습니다. 디비 스키마 확인 혹은 html 클래스명 확인하셈~!';
			}
		});
	} catch (error) {
		console.log(error);
	}
}

const items = document.querySelectorAll('.content__item');
const orderButton = document.querySelector('#order-button');
const basketButton = document.querySelector('#basket-button');

let data;

orderButton.addEventListener('click', clickOrder);
basketButton.addEventListener('click', clickCart);

function clickOrder() {
	console.log('주문 페이지로 이동합니다...');
	// window.location.href = '/orders';
}

function clickCart() {
	const PRODUCTS_KEY = 'products';
	//
	if (!localStorage.getItem(PRODUCTS_KEY)) {
		let tempArr = [data];

		localStorage.setItem(PRODUCTS_KEY, JSON.stringify(tempArr));
	} else {
		let tempArr = JSON.parse(localStorage.getItem(PRODUCTS_KEY));

		tempArr.push(data);
		console.log(tempArr);
		localStorage.setItem(PRODUCTS_KEY, JSON.stringify(tempArr));
	}
	console.log('장바구니에 담았습니다!');
}

getData();