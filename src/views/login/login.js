import * as api from "../api.js";
import { setCookie } from "../utils/cookie.js";
import { isValidEmail, isValidPassword } from "../utils/validator.js";

const loginBtn = document.querySelector("#submitButton");
const buttonSection = document.querySelector(".login-form-text");

const TOKEN = "token";

async function showNaverLoginButton() {
  try {
    const res = await api.get("/api/naver/login");
    const naver = document.createElement("div");
    naver.setAttribute("class", "naver-button");
    naver.innerHTML = res["button"];
    buttonSection.append(naver);
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
