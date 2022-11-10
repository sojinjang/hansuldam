import { post } from "../api.js";

const $ = (selector) => document.querySelector(selector);
const findBtn = $(".find-password-button");
const emailInput = $("#emailInput");
const nameInput = $("#nameInput");

findBtn.addEventListener("click", findPassword);

async function findPassword(e) {
  e.preventDefault();

  const data = {
    email: emailInput.value,
  };

  const emailRegExp =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

  if (emailInput.value == "") {
    alert("이메일을 입력하세요.");
    return;
  }

  if (nameInput.value.length < 2) {
    alert("이름을 다시 확인해주세요.");
    return;
  }

  if (emailInput.value.match(emailRegExp) == null) {
    alert("이메일을 다시 확인해주세요.");
    return;
  }

  try {
    await post("/api/user/random-password/", data);
    alert("임시 비밀번호를 발급했습니다. 비밀번호를 바꿔주세요.");
    window.location.href = "http://localhost:8900/login";
  } catch (e) {
    alert("가입한 이메일이 아닙니다.");
  }
}

//post(data);

//post("/api/user/random-password", data);

// const { email, fullName } = userInfo;

// console.log(email);
// console.log(fullName);
