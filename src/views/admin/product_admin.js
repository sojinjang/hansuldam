import { get, post, patch, delete as del } from "../api.js";
import removeContainer from "./remove_container.js";
import { changeToKoreanTime } from "../utils/useful_functions.js";
import { ApiUrl } from "../constants/ApiUrl.js";
import { ErrorMessage } from "../constants/ErrorMessage.js";

const $ = (selector) => document.querySelector(selector);
const productModalHTML = `<div class="modal">
  <div class="modal-background"></div>
  <div class="modal-content">
    <div class="modal-card add-product-modal">
      <div class="left-modal">
        <input id="name" class="input product-input" type="text" placeholder="이름" />
        <input id="price" class="input product-input" type="number" placeholder="가격" />
        <input id="volume" class="input product-input" type="number" placeholder="용량(ml)" />
        <input id="category" class="input product-input" type="text" placeholder="카테고리" />
        <input id="alcoholType" class="input product-input" type="text" placeholder="종류(탁주)" />
      </div>
      <div class="right-modal">
        <input id="brand" class="input product-input" type="text" placeholder="브랜드명" />
        <input id="stock" class="input product-input" type="number" placeholder="재고" />
        <input id="description" class="input product-input" type="text" placeholder="설명" />
        <input id="sales" class="input product-input" type="number" placeholder="판매량" />
        <input id="alcoholDegree" class="input product-input" type="number" placeholder="도수" />
        <div class="button-container">
          <button class="button-35-brown button add-product-button">완료</button>
          <button class="button-35-white button close-modal-button">닫기</button>
        </div>
      </div>
    </div>
  </div>
</div>`;

async function initFunc() {
  $(".product-menu").addEventListener("click", () => {
    removeContainer();
    openProductMenu();
  });
}

async function fetchProducts(index) {
  const data = await get(`${ApiUrl.PRODUCTS_OVERALL_INFORMATION}${index}&perpage=9`);

  return data;
}

async function openProductMenu() {
  const { products, totalPage } = await fetchProducts(1);
  let productsTotalData = products;

  for (let i = 2; i <= totalPage; i++) {
    (await fetchProducts(i))["products"].forEach((product) => {
      productsTotalData.push(product);
    });
  }

  $(".product-menu").classList.add("isClicked");

  const productContainerHTML = `<section class="products-container">
  <button class="button-35-brown button add-button">추가</button>
  <button class="button-35-white button close-button">닫기</button>
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
  productsTotalData.forEach(async (product, index) => {
    await renderProduct(product);
    if (index === productsTotalData.length - 1) {
      renderProductDetail(productsTotalData);
      deleteProduct();
    }
  });

  $(".close-button").addEventListener("click", closeSection);
  $(".add-button").addEventListener("click", addProduct);
}

function closeSection() {
  if ($(".add-product-modal")) {
    $(".add-product-modal").remove();
  }

  if ($(".add-product-modal")) {
    $(".add-product-modal").remove();
  }

  $(".product-menu").classList.remove("isClicked");
  $(".products-container").remove();
}

function addProduct() {
  if ($(".add-product-modal")) {
    $(".add-product-modal").remove();
  }
  $(".admin-menu").insertAdjacentHTML("afterend", productModalHTML);
  $('.modal').style.opacity = 1;

  $(".add-product-button").addEventListener("click", async () => {
    const productInput = [...document.querySelectorAll(".product-input")];
    const inputObj = productInput.reduce((obj, input) => {
      const fieldName = input.getAttribute("id");
      if (!input.value || input.value == undefined) {
        // 빈 문자열은 undefined, 빈 숫자는 null로 인식합니다.
        obj[fieldName] = undefined;
        return obj;
      } else {
        obj[fieldName] = input.value;
        return obj;
      }
    }, {});

    $(".close-modal-button").addEventListener("click", () => {
      $(".modal").remove();
    });

    try {
      const uploadedProduct = await post(ApiUrl.ADMIN_PRODUCTS, inputObj);
      uploadImageModal(uploadedProduct);

      alert("추가 되었습니다. 이미지를 업로드 해주세요.");
    } catch (e) {
      alert(
        "빈 칸을 채워주세요!\n혹은 카테고리명이 존재하는지 확인하거나 \n다음 에러메시지를 확인해주세요."
      );
      alert(e);
    }
  });

  $(".close-modal-button").addEventListener("click", () => {
    $(".modal").remove();
  });
}

function uploadImageModal(uploadedProduct) {
  const { _id, image } = uploadedProduct;
  const imageUrl = "../" + decodeURIComponent(image).split("views")[1];

  const productModalImageHTML = `<figure class="image"><img class="preview-image" src="${imageUrl}"></figure>
<div class="file">
  <label class="file-label">
    <input class="file-input upload-image-input" type="file" name="resume" accept="image/*">
    <span class="file-cta">
      <span class="file-icon">
        <i class="fas fa-upload"></i>
      </span>
      <span class="file-label">
        이미지를 선택하세요
      </span>
    </span>
    <div class="button-container">
      <button class="button-35-brown button upload-image-button">업로드</button>
      <button class="button-35-white button close-modal-button">닫기</button>
    </div>
  </label>
</div>`;

  $(".add-product-modal").innerHTML = productModalImageHTML;
  $(".upload-image-input").addEventListener("change", (e) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const preview = $(".preview-image");
      preview.src = e.target.result;
    };

    reader.readAsDataURL(e.target.files[0]);
  });
  $(".upload-image-button").addEventListener("click", uploadImagePost);
  $(".close-modal-button").addEventListener("click", () => {
    $(".modal").remove();
  });

  async function uploadImagePost() {
    const formData = new FormData();
    formData.set("uploadImg", document.querySelector(".upload-image-input").files[0]);

    const res = await fetch(`${ApiUrl.IMAGE}/${_id}?location=products`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(ErrorMessage[error.errorCode]);
    }

    $(".modal").remove();
    alert("상품이 등록되었습니다.");
    refreshData();

    const result = await res.json();
    return result;
  }
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
<div class="column is-1"><button id="btn-${_id}" class="button-35-white button column detail-button">상세</button></div>
<div class="column is-1"><button id="${_id}" class="button-35-white button column delete-button">삭제</button></div>
`;

  $(".products-container").append(productSection);
}

async function renderProductDetail(productsTotalData) {
  const detailBtn = document.querySelectorAll(".detail-button");

  detailBtn.forEach((button) => {
    button.addEventListener("click", (e) => {
      const currentId = e.target.getAttribute("id").split("-")[1];
      const currentIndex = productsTotalData.findIndex((product) => product._id === currentId);
      const currentData = productsTotalData[currentIndex];
      const { stock, brand, description, sales, manufacturedDate, alcoholDegree } =
        currentData;

      const detailHtml = `<div class="columns items-container items-detail opened">
      <div class="column is-2">${brand}</div>
      <div class="column is-2">${stock}개 남음</div>
      <div class="column is-2">${description}</div>
      <div class="column is-2">${sales}개 판매</div>
      <div class="column is-2">${changeToKoreanTime(manufacturedDate)}</div>
      <div class="column is-1">${alcoholDegree}도</div>
      <div class="column is-1">
      <button class="button-35-white button column modify-button">수정</button>
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
    button.addEventListener("click", async (e) => {
      const currentId = e.target.getAttribute("id");

      if (confirm("정말 삭제할까요?")) {
        await del(ApiUrl.ADMIN_PRODUCTS, currentId);
        refreshData();
      }
    });
  });
}

function modifyProduct(currentData) {
  const { _id } = currentData;

  if ($(".add-product-modal")) {
    $(".add-product-modal").remove();
  }

  $(".admin-menu").insertAdjacentHTML("afterend", productModalHTML);
  const productsInput = [...document.querySelectorAll(".product-input")];
  $('.modal').style.opacity = 1;

  productsInput.forEach((input) => {
    const fieldId = input.getAttribute("id");
    const fieldName = input.getAttribute("placeholder");

    fieldId === "category"
      ? (input.value = currentData[fieldId])
      : input.setAttribute("placeholder", `${fieldName}: ${currentData[fieldId]}`);
  });

  $(".add-product-button").addEventListener("click", async () => {
    const inputObj = productsInput.reduce((obj, input) => {
      const fieldName = input.getAttribute("id");
      if (!input.value || input.value == undefined) {
        // 빈 문자열은 undefined, 빈 숫자는 null로 인식합니다.
        obj[fieldName] = undefined;
        return obj;
      } else {
        obj[fieldName] = input.value;
        return obj;
      }
    }, {});

    try {
      await patch(ApiUrl.ADMIN_PRODUCTS, _id, inputObj);
      uploadImageModal(currentData);

      alert("수정 되었습니다.\n(선택)이미지를 변경하세요.");
    } catch (e) {
      alert(
        "빈 칸을 채워주세요!\n혹은 카테고리명이 존재하는지 확인하거나 \n다음 에러메시지를 확인해주세요."
      );
      alert(e);
    }
  });

  $(".close-modal-button").addEventListener("click", () => {
    $(".add-product-modal").remove();
    $(".modal").remove();
  });
}

function refreshData() {
  $(".products-container").remove();
  openProductMenu();
}

export { initFunc as showProducts };
