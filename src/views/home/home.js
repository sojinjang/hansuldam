const $ = (selector) => document.querySelector(selector);

// 캐러셀 버튼 클릭 시
const carouselDot = document.querySelectorAll('.carousel-dot');
for (dot of carouselDot) {
  dot.addEventListener('click', clickCarouselDot);
}

function clickCarouselDot(e) {
  const slide = document.querySelector('.carousel-slide');
  const dot = document.querySelectorAll('.carousel-dot');

  dot.forEach((dot, i) => {
    dot.classList.remove('dot-clicked');

    if (dot === e.target) {
      slide.style.transform = `transLateX(-${i * 100}%)`;
      dot.classList.add('dot-clicked');
    }
  });
}

async function renderData() {
  const categoryId = '636b8822d3f00110df72f2e1';
  const res = await fetch(`/api/category/${categoryId}/products`, {
    method: 'GET',
  });

  const fetchData = await res.json();
  const eventProducts = await fetchData['productList'];

  eventProducts.forEach((product) => {
    const { _id, name } = product;
    let productContainer = document.createElement('div');
    productContainer.setAttribute('class', 'products-image-list');
    productContainer.setAttribute('id', _id);
    productContainer.innerHTML = `<div>
		<img
			src="https://d38cxpfv0ljg7q.cloudfront.net/admin_contents/thumbnail/Xp8J-1666763020027-1011ssgp_9241.jpg"
		/>
	</div>
<span>${name}</span>`;

    const eventsContainer = document.querySelector('.products-container');
    eventsContainer.append(productContainer);
  });
}

async function clickSliderButton() {
  await renderData();
  goToDetailPage();

  const productsContainer = document.querySelector('.products-container');
  const maxSlidePage =
    document.querySelectorAll('.products-image-list').length - 4;
  let sliderXValue = 0;
  let count = 0;

  $('.slider-left-button').addEventListener('click', () => {
    if (count > 0) {
      sliderXValue += 210;
      count -= 1;
      productsContainer.style.transform = `transLateX(${sliderXValue}px)`;
    }
  });

  $('.slider-right-button').addEventListener('click', () => {
    if (count < maxSlidePage) {
      sliderXValue -= 210;
      count += 1;
      productsContainer.style.transform = `transLateX(${sliderXValue}px)`;
    }
  });
}

function goToDetailPage() {
  const productContainer = document.querySelectorAll('.products-image-list');
  productContainer.forEach((container) => {
    container.addEventListener('click', (e) => {
      const productId = e.currentTarget.getAttribute('id');
      window.location.href = `/product-detail?id=${productId}`;
    });
  });
}

clickSliderButton();
