import * as api from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";

const reviewModalForm = document.querySelector(".modal-overlay");
const reviewWriteButton = document.querySelector(".review-write-button");
const reviewWriteCloseButton = document.querySelector(".close-area");

const queryString = new Proxy(new URLSearchParams(window.location.search), {
  get: (params, prop) => params.get(prop),
});
const productId = queryString.id;

async function getReviewList() {
  try {
    const reviewList = await api.get(ApiUrl.COMMENTS, productId);
    return reviewList;
  } catch (err) {
    alert(err.message);
  }
}

function showReview(review) {}

async function createReviewList() {
  const reviewList = await getReviewList();
  reviewList.forEach((review) => {
    showReview(review);
  });
}

function addCloseFormEvent(modalForm) {
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

window.addEventListener("load", createReviewList);

reviewWriteButton.addEventListener("click", () => {
  reviewModalForm.style.display = "flex";
});

addCloseFormEvent(reviewModalForm);
