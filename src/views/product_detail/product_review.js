import * as api from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";
import { changeToKoreanTime } from "../utils/useful_functions.js";

const reviewModalForm = document.querySelector(".modal-overlay");
const reviewWriteButton = document.querySelector(".review-write-button");
const reviewWriteCloseButton = document.querySelector(".close-area");
const emptyReview = document.querySelector(".empty-review");
const reviewListContainer = document.querySelector(".review-list-container");

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

function refineTitleAndDirectory(review) {
  let reviewTitle = "";
  let imgDirectory = null;

  if (review.content.length > 60) reviewTitle = review.content.slice(0, 60) + "...";
  else reviewTitle = review.content;
  if (review.image) {
    imgDirectory = "../" + decodeURIComponent(review.image).split("views")[1];
  }

  return { reviewTitle, imgDirectory };
}

function showReview(review) {
  const { reviewTitle, imgDirectory } = refineTitleAndDirectory(review);
  const reviewContainer = document.createElement("div");
  console.log(imgDirectory);
  reviewContainer.setAttribute("class", "single-review-container");
  reviewContainer.setAttribute("id", review._id);
  let reviewElements = `
              <div style='display:flex' class="single-review-title-container">
                <div class="single-review-title-content">${reviewTitle}</div>
  `;
  if (imgDirectory) {
    reviewElements += `
                <div class="image-icon"><img src="../img/image-icon.png"></div>
                <div class="single-review-title-username">${review.userId.fullName}</div>
            </div>
            <div style='display:none' class="single-review-detail-container">
              <div class="review-info">
                <div class="review-date">${changeToKoreanTime(review.createdAt)}</div>
                <div class="review-username">${review.userId.fullName}</div>
              </div>
              <div class="review-content-detail">${review.content}</div>
              <div ><img class="review-img" src=${imgDirectory}></div>
            </div>
    `;
  } else {
    reviewElements += `
                <div class="single-review-title-username">${review.userId.fullName}</div>
            </div>
            <div style='display:none' class="single-review-detail-container">
              <div class="review-info">
                <div class="review-date">${changeToKoreanTime(review.createdAt)}</div>
                <div class="review-username">${review.userId.fullName}</div>
              </div>
              <div class="review-content-detail">${review.content}</div>
            </div>
    `;
  }
  reviewContainer.innerHTML = reviewElements;
  reviewListContainer.append(reviewContainer);
}

async function createReviewList() {
  const reviewList = await getReviewList();
  if (reviewList.length === 0) return;
  emptyReview.style.display = "none";
  reviewList.forEach((review) => {
    showReview(review);
  });
}

function showReviewDetail(e) {
  const titleSection = e.target.parentElement;
  const detailSection = e.target.parentElement.nextElementSibling;
  titleSection.style.display = "none";
  detailSection.style.display = "flex";
}

function hideReviewDetail(e) {
  const detailSection = e.target.parentElement;
  const titleSection = e.target.parentElement.previousElementSibling;
  detailSection.style.display = "none";
  titleSection.style.display = "flex";
}

async function renderReviewData() {
  await createReviewList();

  const singleReviewTitleContentArr = document.querySelectorAll(
    ".single-review-title-content"
  );
  const singleReviewContentDetailArr = document.querySelectorAll(".review-content-detail");

  singleReviewTitleContentArr.forEach((titleElem) => {
    titleElem.addEventListener("click", showReviewDetail);
  });
  singleReviewContentDetailArr.forEach((detailElem) => {
    detailElem.addEventListener("click", hideReviewDetail);
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

renderReviewData();

reviewWriteButton.addEventListener("click", () => {
  reviewModalForm.style.display = "flex";
});
addCloseFormEvent(reviewModalForm);
