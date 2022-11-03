// 예제 데이터
const data = '';

const items = document.querySelectorAll('.content__item');
const orderButton = document.querySelector('#order-button');
const basketButton = document.querySelector('#basket-button');

orderButton.addEventListener('click', clickOrder);
basketButton.addEventListener('click', clickBasket);

function clickOrder() {
	alert('주문 페이지로 이동합니다...');
	window.location.href = '/orders';
}

function clickBasket() {
	alert('장바구니에 담았습니다!');
}
// class명과 일치하는 data값 불러온 후 적용하기
items.forEach((v, i) => {
	const value = items[i].className
		.split(' ')[1]
		.split('content__')[1];

	// v.innerHTML = data[value];
});
