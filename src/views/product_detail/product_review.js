import * as api from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";

const reviewWriteButton = document.querySelector(".review-write-button");

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

function showReview() {}

async function createReviewList() {
  const reviewList = await getReviewList();
  reviewList.forEach((review) => {
    showReview(review);
  });
}

function showReviewForm() {}

window.addEventListener("load", createReviewList);
reviewWriteButton.addEventListener("click", showReviewForm);
