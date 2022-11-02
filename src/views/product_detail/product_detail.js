// 예제 데이터
const data = {
  "_id": "249ee1e45022fa608b63e994",
  "category": "증류주",
  "brand": "전주이강주",
  "name": "조정형 명인 전주 이강주",
  "price": 5500,
  "volume": 375,
  "quantity":  200,
  "img": "#",
  "sold": 10,
  "alcoholType": "증류",
  "alcoholDegree": 19,
  "manufacturedDate": "2022-04-15",
  "createdAt": "2022-06-07T05:28:04.709Z",
  "updatedAt": "2022-06-07T05:32:19.548Z"
};

const items = document.querySelectorAll('.content__item');
const orderButton = document.querySelector('#order-button');
const basketButton = document.querySelector('#basket-button');

orderButton.addEventListener('click', clickOrder);
basketButton.addEventListener('click', clickBasket);

function clickOrder() {
  alert('주문 페이지로 이동합니다...');

  // 임시로 /orders로 이동하게 함.
  window.location.href = "/orders";
}

function clickBasket() {
  alert('장바구니에 담았습니다!');
}

// class명과 일치하는 data값 불러온 후 적용하기
items.forEach((v, i) => {
  const value = items[i]
    .className
    .split(" ")[1]
    .split("content__")[1];

  v.innerHTML = data[value];
})
