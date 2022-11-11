import { get } from '../api.js'
import { changeToKoreanTime } from '../utils/useful_functions.js'
import { getCookieValue } from '../utils/cookie.js';

async function renderData() {
  const queryString = new Proxy(new URLSearchParams(window.location.search), {
    get: (params, prop) => params.get(prop),
  });
  const currentId = queryString.id;
  const fetchedData = await get('/api/products', currentId);
  const {
    _id,
    category,
    brand,
    name,
    price,
    volume,
    description,
    sales,
    alcoholType,
    alcoholDegree,
    manufacturedDate,
  } = fetchedData;

  document.title = `${name} - 한술담 🍶`;

  let productSection = document.createElement('section');

  productSection.setAttribute('class', 'product-container');
  productSection.setAttribute('id', _id);
  productSection.innerHTML = `<div class="product-container">
  <div class="image-warpper">
    <img src="../img/ricewine_icon.png" alt="상품 이미지" />
  </div>
	<div class="content__container">
		<div class="content__main-info">
    <p class="content__item content__name">${name}</p>
    <p class="content__item content__category">${category}</p>
			<p class="content__item content__price">${Number(price).toLocaleString(
        'ko-KR'
      )}원</p>
			<p class="content__desc">${description}</p>
		</div>
		<div class="content__detail-info">
			<p>
				<span class="content__sold">판매량</span>
				<span class="content__item content__sold">${sales}개</span>
			</p>
			<p>
				<span class="content__alcoholType">종류</span>
				<span class="content__item content__alcoholType">${alcoholType}</span>
			</p>
			<p>
				<span class="content__alcoholDegree">도수</span>
				<span class="content__item content__alcoholDegree">${alcoholDegree}도</span>
			</p>
			<p>
				<span class="content__volume">용량</span>
				<span class="content__item content__volume">${volume}ml</span>
			</p>
			<p>
				<span class="content__manufacturedDate">제조일자</span>
				<span class="content__item content__manufacturedDate">${changeToKoreanTime(manufacturedDate)}</span>
			</p>
		</div>
		<div class="button-container">
			<button class="button is-info ml-2" id="order-button">
				주문하기
			</button>
			<button class="button" id="basket-button">장바구니 담기</button>
			<p class="cart-message">
				장바구니에 담았습니다!
			</p>
		</div>
	</div>
</div>`;

  const bodyContainer = document.querySelector('.body-container');

  bodyContainer.append(productSection);

  return fetchedData;
}

async function orderAndCart() {
  let productData = await renderData();

  const orderButton = document.querySelector('#order-button');
  const basketButton = document.querySelector('#basket-button');

  orderButton.addEventListener('click', clickOrder);
  basketButton.addEventListener('click', clickCart);

  function clickOrder() {
    const TOKEN = 'token'
    if(!getCookieValue(TOKEN)) {
      window.location.href = '/order-pay-member';
    } else {
      window.location.href = '/order-pay-nonmember';
    }
  }

  function clickCart() {
    const PRODUCTS_KEY = 'products';
    if (!localStorage.getItem(PRODUCTS_KEY)) {
      let tempArr = [productData];

      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(tempArr));
    } else {
      let tempArr = JSON.parse(localStorage.getItem(PRODUCTS_KEY));

      tempArr.push(productData);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(tempArr));
    }

    // Message
    const cartMessage = document.querySelector('.cart-message');
    cartMessage.classList.add('fade-message');
    setTimeout(() => {
      cartMessage.classList.remove('fade-message');
    }, 1000);
  }
}

orderAndCart();