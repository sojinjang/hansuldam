import * as api from "../api.js";
import { setCookie } from "../utils/cookie.js";
import { isValidEmail, isValidPassword } from "../utils/validator.js";

const loginBtn = document.querySelector("#submitButton");

const TOKEN = "token";

async function showNaverLoginButton() {
  try {
    const res = await api.get("http://localhost:7777/api/naver/login");
    console.log(res);
  } catch (err) {
    alert(err.message);
  }
}

async function logIn(e) {
  e.preventDefault();

  const email = document.querySelector("#emailInput").value;
  const password = document.querySelector("#passwordInput").value;

  if (!isValidEmail(email)) alert("이메일 형식을 다시 확인해주세요.");
  if (!isValidPassword(password)) alert("비밀번호 4자리 이상 입력해주세요.");

  const loginInput = { email, password };

  try {
    const token = await api.post("/api/user/login", loginInput);
    setCookie(TOKEN, token);
    window.location.href = "/";
  } catch (err) {
    alert(err.message);
  }
}

window.addEventListener("load", showNaverLoginButton);
loginBtn.addEventListener("click", logIn);
