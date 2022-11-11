import { isName, isValidEmail } from "../utils/validator.js";
import * as api from "../api.js";

const nameInput = document.querySelector("#nameInput");
const emailInput = document.querySelector("#emailInput");
const joinBtn = document.querySelector(".join-form-button");
const checkOverlabBtn = document.querySelector(".emailOverlap");

let emailCleard = false;

async function checkDuplication(email) {
  try {
    const res = await api.get("../api/user/emailCheck", email);
    return res["isDuplicatedEmail"];
  } catch (err) {
    alert(err.message);
  }
}

async function checkEmail(e) {
  e.preventDefault();
  const email = emailInput.value;

  if (!isValidEmail(email)) {
    alert("유효한 이메일 형식이 아닙니다 👾");
    emailCleard = false;
    return;
  }
  const isDuplicatedEmail = await checkDuplication(email);
  if (isDuplicatedEmail) {
    alert("이미 사용중인 이메일입니다 👻");
    emailCleard = false;
    return;
  }
  emailCleard = true;
  alert("사용 가능한 이메일입니다 ✅");
}

function moveToNextPage() {
  location.href = `join-success.html?${[nameInput.value, emailInput.value]}`;
}

function checkRequest(e) {
  e.preventDefault();
  if (!isName(nameInput.value)) {
    alert("이름 입력값을 확인해주세요 📛");
    return;
  }
  if (!emailCleard) {
    alert("이메일 중복검사를 실행해주세요❗️");
    return;
  } else {
    moveToNextPage();
  }
}

checkOverlabBtn.addEventListener("click", checkEmail);
joinBtn.addEventListener("click", checkRequest);
