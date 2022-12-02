import { get } from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";
import { changeToKoreanWon } from "../utils/useful_functions.js";

const $ = (selector) => document.querySelector(selector);

const carouselImages = document.querySelectorAll(".carousel-img");
const carouselDots = document.querySelectorAll(".carousel-dot");

carouselImages.forEach((image) => {
  image.addEventListener("click", () => (window.location.href = "/event-page/"));
});

carouselDots.forEach((dot) => {
  dot.addEventListener("click", clickCarouselDot);
});

setInterval(autoSlideCarousel, 4000);

function autoSlideCarousel() {
  const slide = document.querySelector(".carousel-slide");
  let currentSlide = parseInt(`-${slide.style.transform.match(/\d+/g)}`);

  currentSlide === -200 ? (currentSlide = 0) : (currentSlide += -100);
  slide.style.transform = `translateX(${currentSlide}%)`;

  (function handleCarouselDot() {
    const currentDotIndex = Math.abs(currentSlide / 100);
    
    carouselDots.forEach((dot) => dot.classList.remove("dot-clicked"));
    carouselDots[currentDotIndex].classList.add("dot-clicked");
  })();
}

function clickCarouselDot(e) {
  const slide = document.querySelector(".carousel-slide");

  carouselDots.forEach((dot, i) => {
    dot.classList.remove("dot-clicked");

    if (dot === e.target) {
      slide.style.transform = `transLateX(-${i * 100}%)`;
      dot.classList.add("dot-clicked");
    }
  });
}

const alcoholTypeButton = document.querySelectorAll(".sool-item");

alcoholTypeButton.forEach((alcoholType) => {
  alcoholType.addEventListener("click", (e) => {
    const alcoholTypeId = e.currentTarget.getAttribute("id");
    window.location.href = `/filter?alcoholType=${alcoholTypeId}&page=1`;
  });
});

async function fetchCategory() {
  const categoryData = await get(ApiUrl.CATEGORY);
  const categoryId = categoryData[0]["_id"];

  const productsInCategory = await get(`${ApiUrl.CATEGORY}/${categoryId}/products`);

  return productsInCategory;
}

async function renderData() {
  const productsInCategory = await fetchCategory();
  const eventProducts = productsInCategory["productList"];

  eventProducts.forEach((product) => {
    const { _id, name, image, price } = product;
    const imageUrl = "../" + decodeURIComponent(image).split("views")[1];

    let productContainer = document.createElement("div");
    productContainer.setAttribute("class", "products-image-list");
    productContainer.setAttribute("id", _id);
    productContainer.innerHTML = `<div>
		<img
			src="${imageUrl}"
		/>
	</div>
<span>${name}</span>
<span>${changeToKoreanWon(price)}<span class="won">원</span></span>`;
    const eventsContainer = document.querySelector(".products-container");
    eventsContainer.append(productContainer);
  });
}

async function clickSliderButton() {
  await renderData();
  goToDetailPage();

  const productsContainer = document.querySelector(".products-container");
  const maxSlidePage = document.querySelectorAll(".products-image-list").length - 4;
  let sliderXValue = 0;
  let count = 0;

  $(".slider-left-button").addEventListener("click", () => {
    if (count > 0) {
      sliderXValue += 210;
      count -= 1;
      productsContainer.style.transform = `transLateX(${sliderXValue}px)`;
    }
  });

  $(".slider-right-button").addEventListener("click", () => {
    if (count < maxSlidePage) {
      sliderXValue -= 210;
      count += 1;
      productsContainer.style.transform = `transLateX(${sliderXValue}px)`;
    }
  });
}

function goToDetailPage() {
  const productContainer = document.querySelectorAll(".products-image-list");
  productContainer.forEach((container) => {
    container.addEventListener("click", (e) => {
      const productId = e.currentTarget.getAttribute("id");
      window.location.href = `/product-detail?id=${productId}`;
    });
  });
}

clickSliderButton();
