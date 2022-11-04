async function fetchData() {
	const res = await fetch('http://localhost:8900/api/products', {
		method: 'GET',
	});

	return await res.json();
}

async function getData() {
	try {
		const data = await fetchData();

		console.log(items);
		items.forEach((v, i) => {
			const value = items[i].className.split(' ')[1].split('content__')[1];
			
			if (data[0][value] !== undefined) {
				v.innerHTML = data[0][value];
			} else {
				v.innerHTML = '정보가 없습니다. 디비 스키마 확인 혹은 html 클래스명 확인하셈~!';
			}
		});
	} catch (error) {
		console.log(error);
	}
	
}


const items = document.querySelectorAll('.content__item');
const orderButton = document.querySelector('#order-button');
const basketButton = document.querySelector('#basket-button');

orderButton.addEventListener('click', clickOrder);
basketButton.addEventListener('click', clickBasket);

function clickOrder() {
	console.log('주문 페이지로 이동합니다...');
	// window.location.href = '/orders';
}

function clickBasket() {
	console.log('장바구니에 담았습니다!');
}
// class명과 일치하는 data값 불러온 후 적용하기

getData();