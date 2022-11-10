import { isName, isValidEmail } from "../utils/validator.js";
import * as api from "../api.js";

const nameInput = document.querySelector("#nameInput");
const emailInput = document.querySelector("#emailInput");
const joinBtn = document.querySelector(".join-form-button");
const checkOverlabBtn = document.querySelector(".emailOverlap");

let emailCleard = false;

function isDuplicatedEmail(email) {
  // todo: 장바구니 api 만들어지는대로 변경
  const tempData = ["elice@test.com"];

  if (tempData.includes(email)) {
    return true;
  }
  return false;
}

function checkEmail() {
  const email = emailInput.value;

  if (!isValidEmail(email)) {
    alert("유효한 이메일 형식이 아닙니다.");
    emailCleard = false;
    return;
  }
  if (isDuplicatedEmail(email)) {
    alert("이미 사용중인 이메일입니다.");
    emailCleard = false;
    return;
  }
  emailCleard = true;
  alert("사용 가능한 이메일입니다 ✅");
  // todo: 사용 가능한 이메일입니다. 작은 글씨로 띄워주기
}

function moveToNextPage() {
  location.href = `join-success.html?${[nameInput.value, emailInput.value]}`;
}

function checkRequest(e) {
  e.preventDefault();
  if (!isName(nameInput.value)) {
    alert("이름 입력값을 확인해주세요.");
    return;
  }
  if (!emailCleard) {
    alert("이메일 중복검사를 실행해주세요.");
    return;
  } else {
    moveToNextPage();
  }
}

checkOverlabBtn.addEventListener("click", checkEmail);
joinBtn.addEventListener("click", checkRequest);
