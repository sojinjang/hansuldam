import { get, patch } from "../api.js";

const pwChangeBox = document.querySelector("#change-password-container");
const userPassword = document.querySelector("#user-password");
const changePasswordInput = document.querySelector(".changePassword");
const changePasswordCheck = document.querySelector(".changePasswordCheck");
const currentPassword = document.querySelector(".currentPassword");

export function openPasswordPage(e) {
  e.preventDefault();

  pwChangeBox.style.display = "flex";
}

// 비밀번호 변경 확인 버튼 눌렀을 때
// 기존 정보내용 바꾸고 db에 내용 보내기
export async function changePassword(e) {
  e.preventDefault();

  const userData = await get("/api/auth", "user");

  const newPassword = {
    password: currentPassword.value,
    newPassword: changePasswordInput.value,
  };

  if (
    currentPassword.value == "" ||
    changePasswordInput.value == "" ||
    changePasswordCheck.value == ""
  ) {
    alert("비밀번호 입력칸을 확인해주세요.");
    return;
  }
  if (changePasswordInput.value !== changePasswordCheck.value) {
    alert("새로운 비밀번호가 일치하지 않습니다.");
    return;
  }

  try {
    await patch("/api/auth", "user", newPassword);
    console.log("비밀번호가 변경되었습니다.");
    userPassword.innerHTML = changePasswordInput.value;
    pwChangeBox.style.display = "none";
  } catch (e) {
    alert("문제가 발생했습니다. 다시 시도해주세요.");
  }
}
