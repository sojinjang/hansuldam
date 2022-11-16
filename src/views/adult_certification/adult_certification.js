import { isName, isIdNum, isAdult } from "../utils/validator.js";
import { setCookie } from "../utils/cookie.js";
import { Keys } from "../constants/Keys.js";

const name = document.querySelector("#nameForValidation");
const idNum = document.querySelector("#idNum");
const adultcheckBtn = document.querySelector(".adultCheckButton");

function examineIdNumber() {
  const idNumValue = idNum.value.trim();
  if (idNumValue.length === 0) {
    alert("주민번호를 입력해주세요.");
    return;
  }
  if (!isIdNum(idNumValue)) {
    alert(
      "주민등록번호 형식에 맞지 않는 입력값입니다.\n######-####### 형식으로 입력해주세요."
    );
    return;
  }
  if (isAdult(idNumValue)) {
    setCookie(Keys.IS_ADULT_KEY, { [Keys.IS_ADULT_KEY]: true });
    alert("성인 인증에 성공했습니다 🪪");
    window.location.href = "/order-pay-nonmember";
    return;
  } else {
    alert("미성년자는 구입 불가능합니다 ❌");
    return;
  }
}

function examineForAdultIdentification(e) {
  e.preventDefault();
  if (!isName(name.value)) {
    alert("이름 입력값을 확인해주세요.");
    return;
  }
  examineIdNumber();
}

adultcheckBtn.addEventListener("click", examineForAdultIdentification);
