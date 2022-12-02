import * as api from "../api.js";
import { getCookieValue } from "../utils/cookie.js";
import { isValidComment } from "../utils/validator.js";
import { ApiUrl } from "../constants/ApiUrl.js";
import { Keys } from "../constants/Keys.js";

const reviewModalForm = document.querySelector(".modal-overlay");
const reviewWriteButton = document.querySelector(".review-write-button");
const reviewWriteCloseButton = document.querySelector(".close-area");
const reviewSubmitButton = document.querySelector(".review-submit-button");
const reviewImgInput = document.querySelector("input[type=file]");

const queryString = new Proxy(new URLSearchParams(window.location.search), {
  get: (params, prop) => params.get(prop),
});
const productId = queryString.id;

const isLoggedIn = Boolean(getCookieValue(Keys.TOKEN_KEY));
let isBuyer = false;

function handlOpenReviewForm(modalForm, isBuyer) {
  if (isBuyer) {
    reviewWriteButton.addEventListener("click", () => {
      modalForm.style.display = "flex";
    });
  } else {
    reviewWriteButton.addEventListener("click", () => {
      alert("구매평 작성이 가능한 주문이 존재하지 않습니다 😞");
    });
  }
}

function addFormCloseEvent(modalForm) {
  reviewWriteCloseButton.addEventListener("click", () => {
    modalForm.style.display = "none";
  });

  modalForm.addEventListener("click", (e) => {
    const evTarget = e.target;
    if (evTarget.classList.contains("modal-overlay")) {
      modalForm.style.display = "none";
    }
  });

  window.addEventListener("keyup", (e) => {
    if (modalForm.style.display === "flex" && e.key === "Escape") {
      modalForm.style.display = "none";
    }
  });
}

async function getUserOrderArr() {
  try {
    const info = await api.get(ApiUrl.USER_INFORMATION);
    return info.orders;
  } catch (err) {
    alert(err.message);
  }
}

function collectProductId(productsArr, accumulatedProductArr) {
  productsArr.forEach((product) => {
    accumulatedProductArr = [...accumulatedProductArr, product.id];
  });
  return accumulatedProductArr;
}

async function getUserProductArr(orderArr) {
  let totalProductArr = [];
  for await (const orderId of orderArr) {
    try {
      const productsObj = await api.get(ApiUrl.ORDERS, orderId);
      const accumulatedProductArr = collectProductId(productsObj.productsInOrder, []);
      totalProductArr = [...totalProductArr, ...accumulatedProductArr];
    } catch (err) {
      alert(err.message);
    }
  }
  return totalProductArr;
}

async function verifyBuyer(productId) {
  const orderArr = await getUserOrderArr();
  const productArr = await getUserProductArr(orderArr);
  return productArr.includes(productId);
}

function makeCommentObj(comment) {
  return { productId: productId, content: comment };
}

async function uploadImage(commentId) {
  if (!reviewImgInput.files[0]) return;
  const formData = new FormData();
  formData.set("uploadImg", reviewImgInput.files[0]);
  try {
    api.postImg(`${ApiUrl.IMAGE}/${commentId}?location=comments`, formData);
  } catch (err) {
    alert(err.message);
  }
  return;
}

async function submitReview() {
  const comment = document.querySelector(".review-input").value;
  if (!isValidComment(comment)) return alert("최소 7자 이상 작성해주세요. ✍️");
  const commentObj = makeCommentObj(comment);
  try {
    const response = await api.post(ApiUrl.AUTH_COMMENTS, commentObj);
    uploadImage(response._id);
    location.reload();
  } catch (err) {
    alert(err.message);
  }
}

if (isLoggedIn) isBuyer = await verifyBuyer(productId);
handlOpenReviewForm(reviewModalForm, isBuyer);
addFormCloseEvent(reviewModalForm);
reviewSubmitButton.addEventListener("click", submitReview);

reviewImgInput.onchange = () => {
  if (reviewImgInput.files.length > 0) {
    const fileName = document.querySelector(".file-name");
    fileName.textContent = reviewImgInput.files[0].name;
  }
  const reader = new FileReader();
  reader.readAsDataURL(reviewImgInput.files[0]);
};
