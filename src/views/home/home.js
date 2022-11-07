const $ = selector => document.querySelector(selector);
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

async function clickSliderButton() {
	await renderData();

	const productsContainer = document.querySelector('.products-container');
	const maxSlidePage = document.querySelectorAll('.products-image-list').length - 4;
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

async function renderData() {
  const res = await fetch(
    'http://localhost:8900/api/category/63689bbb0dc55a83467142cc/products',
    {
      method: 'GET',
    }
  );
	
	const eventProducts = await res.json();

	eventProducts.forEach((product) => {
		const { name } = product;
		let productContainer = document.createElement('div');
		productContainer.setAttribute('class', 'products-image-list');
		// productContainer.setAttribute('id', _id);
		productContainer.innerHTML = `<div>
		<img
			src="https://d38cxpfv0ljg7q.cloudfront.net/admin_contents/thumbnail/Xp8J-1666763020027-1011ssgp_9241.jpg"
		/>
	</div>
<span>${name}</span>`;

		const eventsContainer = document.querySelector('.products-container');
		eventsContainer.append(productContainer);
	});
};

clickSliderButton();