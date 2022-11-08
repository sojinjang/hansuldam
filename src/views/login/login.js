import { setCookie } from "../utils/cookie.js";

const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");
const loginBtn = document.querySelector("#submitButton");

const TOKEN = "token";

async function logIn(e) {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;
  const emailRegExp =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

  if (email.match(emailRegExp) == null) {
    alert("이메일 형식을 다시 확인해주세요.");
    return;
  }

  if (password.length < 4) {
    alert("비밀번호 4자리 이상 입력해주세요");
    return;
  }

  const inputData = {
    email: email,
    password: password,
  };

  try {
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    });
    const token = await response.json();
    setCookie(TOKEN, token);
    sessionStorage.setItem("token", JSON.stringify(token));
  } catch (err) {
    console.error(err.stack);
    alert(err.errorMessage);
  }
}

// 회원가입 버튼을 눌렀을 때 버튼 태그에 링크 걸어둠
// 비밀번호 찾기 버튼 눌렀을 때 버튼 태그에 링크 걸어둠

loginBtn.addEventListener("click", logIn);
