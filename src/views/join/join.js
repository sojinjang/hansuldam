const body = document.querySelector(".body-container");
const nameInput = document.querySelector("#nameInput");
const emailInput = document.querySelector("#emailInput");
const joinBtn = document.querySelector(".join-form-button");
const checkOverlabBtn = document.querySelector(".emailOverlap");

let emailCleard = false;

function isName(name) {
  return /^[가-힣]{2,4}/.test(name);
}

function isValidEmail(email) {
  const emailRegExp =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  return emailRegExp.test(email);
}

function isDuplicatedEmail(email) {
  const data = ["elice@test.com"]; // 임시 데이터

  if (data.includes(email)) {
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
