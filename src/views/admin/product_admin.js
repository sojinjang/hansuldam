import { get, post, patch, delete as del } from "../api.js";
import removeContainer from "./remove_container.js";
import { changeToKoreanTime } from "../utils/useful_functions.js";
import { ApiUrl } from "../constants/ApiUrl.js";

const $ = (selector) => document.querySelector(selector);

async function initFunc() {
  $(".product-menu").addEventListener("click", () => {
    removeContainer();
    openProductMenu();
  });
}

async function fetchProducts(index) {
  const data = await get(`${ApiUrl.PRODUCTS_OVERALL_INFORMATION}${index}`);

  return data;
}

async function openProductMenu() {
  const fetchData = await get(ApiUrl.PRODUCTS);
  const { totalPage } = fetchData;
  const pageOneProducts = fetchData["products"];

  let productsData = pageOneProducts;

  for (let i = 2; i <= totalPage; i++) {
    (await fetchProducts(i))["products"].forEach((product) => {
      productsData.push(product);
    });
  }

  $(".product-menu").classList.add("isClicked");

  const productContainerHTML = `<section class="products-container">
  <button class="button add-button">추가</button>
  <button class="button close-button">닫기</button>
  <div class="columns title-container">
  <div class="column is-2 row-name">이름/브랜드</div>
  <div class="column is-2 row-price">가격/재고</div>
  <div class="column is-2 row-volumn">용량/설명</div>
  <div class="column is-2 row-category">카테고리/판매량</div>
  <div class="column is-2 row-type">타입/제조일자</div>
  <div class="column is-1 row-type">상세/도수</div>
  <div class="column is-1 row-type">삭제</div>
</div>
</section>`;

  await $(".admin-menu").insertAdjacentHTML("afterend", productContainerHTML);
  productsData.forEach(async (product, index) => {
    await renderProduct(product);
    if (index === productsData.length - 1) {
      renderProductDetail();
      deleteProduct();
    }
  });

  $(".close-button").addEventListener("click", closeSection);
  $(".add-button").addEventListener("click", addProduct);
}

function closeSection() {
  if ($(".modify-product-modal")) {
    $(".modify-product-modal").remove();
  }

  if ($(".add-product-modal")) {
    $(".add-product-modal").remove();
  }

  $(".product-menu").classList.remove("isClicked");
  $(".products-container").remove();
}

function addProduct() {
  if ($(".modify-product-modal")) {
    $(".modify-product-modal").remove();
  }
  $(".add-button").classList.add("none");
  $(".close-button").classList.add("none");

  const productModalHtml = `<div class="modal">
  <div class="modal-background"></div>
  <div class="modal-content">
    <label class="add-product-modal">
      <div class="left-modal">
        <input id="name" class="input is-rounded product-input" type="text" placeholder="이름" />
        <input id="price" class="input is-rounded product-input" type="text" placeholder="가격" />
        <input id="volume" class="input is-rounded product-input" type="text" placeholder="용량(ml)" />
        <input id="category" class="input is-rounded product-input" type="text" placeholder="카테고리" />
        <input id="alcoholType" class="input is-rounded product-input" type="text" placeholder="종류(탁주)" />
      </div>
      <div class="right-modal">
        <input id="brand" class="input is-rounded product-input" type="text" placeholder="브랜드명" />
        <input id="stock" class="input is-rounded product-input" type="text" placeholder="재고" />
        <input id="description" class="input is-rounded product-input" type="text" placeholder="설명" />
        <input id="sales" class="input is-rounded product-input" type="text" placeholder="판매량" />
        <input id="manufacturedDate" class="input is-rounded product-input" type="text" placeholder="제조일자" />
        <input id="alcoholDegree" class="input is-rounded product-input" type="text" placeholder="도수" />
        <div>
          <button class="button add-product-button">추가</button>
          <button class="button close-modal-button">닫기</button>
        </div>
      </div>
    </label>
  </div>
  <button class="modal-close is-large"></button>
</div>`;

  $(".admin-menu").insertAdjacentHTML("afterend", productModalHtml);

  $(".add-product-button").addEventListener("click", async (e) => {
    e.preventDefault();
    const productInput = [...document.querySelectorAll(".product-input")];
    const inputObj = productInput.reduce((obj, input) => {
      if (
        input.getAttribute("id") === price ||
        input.getAttribute("id") === volume ||
        input.getAttribute("id") === stock ||
        input.getAttribute("id") === sales ||
        input.getAttribute("id") === alcoholDegree
      ) {
        input.value = Number(input.value);
      }

      if (!input.value || input.value == undefined) {
        // 문자열은 undefined, 숫자는 null로 인식합니다.
        return (input.value = "빈 칸을 채워주세요!");
      } else {
        obj[input.getAttribute("id")] = input.value;
        return obj;
      }
    }, {});

    try {
      await post(ApiUrl.ADMIN_PRODUCTS, inputObj);

      $(".add-product-modal").remove();
      if ($(".add-category-modal")) {
        $(".add-category-modal").remove();
      }
      alert("추가 되었습니다. 페이지를 다시 로드해주세요.");
    } catch (e) {
      alert(e);
    }
  });

  $(".close-modal-button").addEventListener("click", () => {
    $(".add-product-modal").remove();
    refreshData();
  });
}

async function renderProduct(product) {
  const { _id, name, price, volume, category, alcoholType } = await product;

  let productSection = document.createElement("div");

  productSection.setAttribute("class", "columns items-container");
  productSection.setAttribute("id", _id);
  productSection.innerHTML = `<div class="column is-2 row-name">${name}</div>
<div class="column is-2 row-price">${Number(price).toLocaleString("ko-KR")}원</div>
<div class="column is-2 row-volumn">${volume}ml</div>
<div class="column is-2 row-category">${category}</div>
<div class="column is-2 row-type">${alcoholType}</div>
<div class="column is-1"><button id="btn-${_id}" class="button column detail-button">상세</button></div>
<div class="column is-1"><button id="${_id}" class="button column delete-button">삭제</button></div>
`;

  $(".products-container").append(productSection);
}

let totalPage = 0;

async function renderProductDetail() {
  const fetchData = await get(ApiUrl.PRODUCTS);
  const productsData = fetchData["products"];
  let productsTotalData = productsData;

  totalPage = fetchData["totalPage"];

  for (let i = 2; i <= totalPage; i++) {
    (await fetchProducts(i))["products"].forEach((product) => {
      productsTotalData.push(product);
    });
  }

  const detailBtn = document.querySelectorAll(".detail-button");

  detailBtn.forEach((button) => {
    button.addEventListener("click", (e) => {
      const currentId = e.target.getAttribute("id").split("-")[1];
      const currentIndex = productsData.findIndex((product) => product._id === currentId);
      const currentData = productsData[currentIndex];
      const { _id, stock, brand, description, sales, manufacturedDate, alcoholDegree } =
        currentData;

      const detailHtml = `<div class="columns items-container items-detail opened" id="${_id}">
      <div class="column is-2">${brand}</div>
      <div class="column is-2">${stock}개 남음</div>
      <div class="column is-2">${description}</div>
      <div class="column is-2">${sales}개 판매</div>
      <div class="column is-2">${changeToKoreanTime(manufacturedDate)}</div>
      <div class="column is-1">${alcoholDegree}도</div>
      <div class="column is-1">
      <button class="button column modify-button">수정</button>
      </div>
      </div>`;

      if (e.target.innerHTML === "상세") {
        if ($(".items-detail")) {
          const detailButtons = document.querySelectorAll(".detail-button");
          detailButtons.forEach((button) => {
            button.innerHTML = "상세";
          });
          $(".items-detail").remove();
        }
        e.target.parentNode.parentNode.insertAdjacentHTML("afterend", detailHtml);
        e.target.innerHTML = "닫기";
      } else {
        e.target.innerHTML = "상세";
        $(".items-detail").remove();
      }

      const modifyBtn = document.querySelector(".modify-button");
      if (modifyBtn) {
        modifyBtn.addEventListener("click", () => {
          if ($(".add-product-modal")) {
            $(".add-product-modal").remove();
          }
          modifyProduct(currentData);
          window.scrollTo(0, 580);
        });
      }
    });
  });
}

function deleteProduct() {
  const deleteBtn = document.querySelectorAll(".delete-button");
  deleteBtn.forEach((button) => {
    button.addEventListener("click", (e) => {
      const currentId = e.target.getAttribute("id");
      if (!$(".is-danger")) {
        alert("삭제 하려면 다시 한 번 눌러주세요!");
      }

      e.target.setAttribute("class", "button column is-danger delete-button-confirm");

      $(".delete-button-confirm").addEventListener("click", async () => {
        await del(ApiUrl.ADMIN_PRODUCTS, currentId);
        refreshData();
      });
    });
  });
}

function modifyProduct(currentData) {
  const {} = currentData;

  if ($(".modify-product-modal")) {
    $(".modify-product-modal").remove();
  }
  const productId = $(".opened").getAttribute("id");
  const productModalHtml = `<form>
<label class="modify-product-modal">
  <div class="left-modal">
    <input id="name" class="input is-rounded product-input" type="text" placeholder="이름" />
    <input id="price" class="input is-rounded product-input" type="text" placeholder="가격" />
    <input id="volume" class="input is-rounded product-input" type="text" placeholder="용량(ml)" />
    <input id="category" class="input is-rounded product-input" type="text" placeholder="카테고리" />
    <input id="alcoholType" class="input is-rounded product-input" type="text" placeholder="종류(탁주)" />
  </div>
  <div class="right-modal">
    <input id="brand" class="input is-rounded product-input" type="text" placeholder="브랜드명" />
    <input id="stock" class="input is-rounded product-input" type="text" placeholder="재고" />
    <input id="description" class="input is-rounded product-input" type="text" placeholder="설명" />
    <input id="sales" class="input is-rounded product-input" type="text" placeholder="판매량" />
    <input id="manufacturedDate" class="input is-rounded product-input" type="text" placeholder="제조일자" />
    <input id="alcoholDegree" class="input is-rounded product-input" type="text" placeholder="도수" />
    <div>
      <button class="button modify-product-button">수정</button>
      <button class="button close-modal-button">닫기</button>
    </div>
  </div>
</label>
</form>`;

  $(".admin-menu").insertAdjacentHTML("afterend", productModalHtml);

  $(".modify-product-button").addEventListener("click", async () => {
    const productInput = [...document.querySelectorAll(".product-input")];
    const inputObj = productInput.reduce((obj, input) => {
      if (
        input.getAttribute("id") === price ||
        input.getAttribute("id") === volume ||
        input.getAttribute("id") === stock ||
        input.getAttribute("id") === sales ||
        input.getAttribute("id") === alcoholDegree
      ) {
        input.value = Number(input.value);
      }
      if (!input.value || input.value == undefined) {
        return (input.value = "빈 칸을 채워주세요!");
      } else {
        obj[input.getAttribute("id")] = input.value;
        return obj;
      }
    }, {});

    try {
      await patch(ApiUrl.ADMIN_PRODUCTS, productId, inputObj);

      alert("수정 되었습니다. 페이지를 다시 로드해주세요.");
      $(".modify-product-modal").remove();
    } catch (e) {
      alert(e);
    }
  });

  $(".close-modal-button").addEventListener("click", () => {
    $(".modify-product-modal").remove();
    refreshData();
  });
}

function refreshData() {
  $(".products-container").remove();
  openProductMenu();
}

export { initFunc as showProducts };
