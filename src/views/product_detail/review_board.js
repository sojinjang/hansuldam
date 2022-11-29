import * as api from "../api.js";
import { getCookieValue } from "../utils/cookie.js";
import { ApiUrl } from "../constants/ApiUrl.js";
import { changeToKoreanTime } from "../utils/useful_functions.js";
import { Keys } from "../constants/Keys.js";

const emptyReview = document.querySelector(".empty-review");
const reviewListContainer = document.querySelector(".review-list-container");

const queryString = new Proxy(new URLSearchParams(window.location.search), {
  get: (params, prop) => params.get(prop),
});
const productId = queryString.id;
const userId = getCookieValue(Keys.USER_ID_KEY);

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
    imgDirectory = ".." + decodeURIComponent(review.image).split("views")[1];
  }

  return { reviewTitle, imgDirectory };
}

function createReviewContent(reviewElements, review, imgDirectory) {
  if (imgDirectory)
    return (
      reviewElements +
      `
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
              `
    );
  return (
    reviewElements +
    `
                <div class="single-review-title-username">${review.userId.fullName}</div>
            </div>
            <div style='display:none' class="single-review-detail-container">
              <div class="review-info">
                <div class="review-date">${changeToKoreanTime(review.createdAt)}</div>
                <div class="review-username">${review.userId.fullName}</div>
              </div>
              <div class="review-content-detail">${review.content}</div>
    `
  );
}

function createModificationDeletionButton(reviewElements, isWriter) {
  if (isWriter)
    return (
      reviewElements +
      `       <div class="writer-button-container">
                <div class="review-modification">수정</div>
                <div class="review-deletion">삭제</div>
              </div>
            </div>    
    `
    );
  return reviewElements + `<div>`;
}

function showReview(review) {
  const isWriter = userId === review.userId._id;
  const { reviewTitle, imgDirectory } = refineTitleAndDirectory(review);
  const reviewContainer = document.createElement("div");
  reviewContainer.setAttribute("class", "single-review-container");
  reviewContainer.setAttribute("id", review._id);
  let reviewElements = `
              <div style='display:flex' class="single-review-title-container">
                <div class="single-review-title-content">${reviewTitle}</div>
  `;
  reviewElements = createReviewContent(reviewElements, review, imgDirectory);
  reviewElements = createModificationDeletionButton(reviewElements, isWriter);

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

renderReviewData();
