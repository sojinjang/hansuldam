import { patch } from "../api.js";

const numChangeBox = document.querySelector("#change-phoneNumber-container");
const userPhoneNumber = document.querySelector("#user-phoneNumber-number");
const changePhoneNumberInput = document.querySelector(".changePhoneNumber");

export function openPhoneNumberPage(e) {
  e.preventDefault();

  numChangeBox.style.display = "flex";
}

// 전화번호 변경 확인 버튼 눌렀을 때
// 기존 정보내용 바꾸고 db에 내용 보내기
export async function changePhoneNumber(e) {
  e.preventDefault();
  const phoneNumber = {
    phoneNumber: changePhoneNumberInput.value,
  };
  const regExp = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})[0-9]{3,4}[0-9]{4}$/;
  // 새로운 전화번호를 입력했을 때
  if (
    changePhoneNumberInput.value == "" ||
    changePhoneNumberInput.value.match(regExp) == null
  ) {
    alert("전화번호를 정확히 입력해주세요.");
    return;
  }

  if (changePhoneNumberInput.value == userPhoneNumber.innerHTML) {
    alert("전화번호를 다르게 입력해주세요.");
    return;
  }

  try {
    await patch("/api/auth", "user", phoneNumber);
    alert("전화번호가 변경되었습니다.");
    userPhoneNumber.innerHTML = changePhoneNumberInput.value;
    numChangeBox.style.display = "none";
  } catch (e) {
    alert("문제가 발생했습니다. 다시 확인해주세요.");
  }
}
