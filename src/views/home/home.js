import { get } from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";

const $ = (selector) => document.querySelector(selector);

const carouselDot = document.querySelectorAll(".carousel-dot");

carouselDot.forEach((dot) => {
  dot.addEventListener("click", clickCarouselDot);
});

function clickCarouselDot(e) {
  const carouselDot = document.querySelectorAll(".carousel-dot");
  const slide = document.querySelector(".carousel-slide");

  carouselDot.forEach((dot, i) => {
    dot.classList.remove("dot-clicked");

    if (dot === e.target) {
      slide.style.transform = `transLateX(-${i * 100}%)`;
      dot.classList.add("dot-clicked");
    }
  });
}

async function fetchCategory() {
  const categoryData = await get(ApiUrl.CATEGORY);
  const categoryId = categoryData[0]["_id"];

  const productsInCategory = await get(
    `${ApiUrl.CATEGORY}/${categoryId}/products`
  );

  return productsInCategory;
}

async function renderData() {
  const productsInCategory = await fetchCategory();
  const eventProducts = productsInCategory["productList"];

  eventProducts.forEach((product) => {
    const { _id, name } = product;
    let productContainer = document.createElement("div");
    productContainer.setAttribute("class", "products-image-list");
    productContainer.setAttribute("id", _id);
    productContainer.innerHTML = `<div>
		<img
			src="https://d38cxpfv0ljg7q.cloudfront.net/admin_contents/thumbnail/Xp8J-1666763020027-1011ssgp_9241.jpg"
		/>
	</div>
<span>${name}</span>`;

    const eventsContainer = document.querySelector(".products-container");
    eventsContainer.append(productContainer);
  });
}

async function clickSliderButton() {
  await renderData();
  goToDetailPage();

  const productsContainer = document.querySelector(".products-container");
  const maxSlidePage =
    document.querySelectorAll(".products-image-list").length - 4;
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

// addEventsInDots();
clickSliderButton();
