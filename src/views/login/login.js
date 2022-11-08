import { setCookie } from "../utils/cookie.js";

const loginBtn = document.querySelector("#submitButton");

const TOKEN = "token";

function isValidEmail(email) {
  const emailRegExp =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  return emailRegExp.test(email);
}

function isValidPassword(password) {
  return password.length > 3;
}

async function logIn(e) {
  e.preventDefault();

  const email = document.querySelector("#emailInput").value;
  const password = document.querySelector("#passwordInput").value;

  if (!isValidEmail(email)) alert("이메일 형식을 다시 확인해주세요.");
  if (!isValidPassword(password)) alert("비밀번호 4자리 이상 입력해주세요.");

  const loginInput = { email, password };

  try {
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInput),
    });
    const token = await response.json();
    setCookie(TOKEN, token);
  } catch (err) {
    console.error(err);
    alert(err.errorMessage);
  }
}

// 회원가입 버튼을 눌렀을 때 버튼 태그에 링크 걸어둠
// 비밀번호 찾기 버튼 눌렀을 때 버튼 태그에 링크 걸어둠

loginBtn.addEventListener("click", logIn);
