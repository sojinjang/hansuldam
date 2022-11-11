import { isNum, isIdNum, isAdult } from "../utils/validator.js";
import * as api from "../api.js";

const main_form = document.querySelector(".body-join-form");

const nameForValidation = document.querySelector("#nameForValidation");
const idNum = document.querySelector("#idNum");
const adultcheckBtn = document.querySelector(".adultCheckButton");

const email = document.querySelector("#email");
const username = document.querySelector("#name");
const password = document.querySelector("#passwordInput");
const passwordCheck = document.querySelector("#passwordCheck");
const address = document.querySelector("#addressLocation");
const addressDetail = document.querySelector("#addressDetail");
const phoneNumber = document.querySelector("#phoneNumber");
const joinCompletedBtn = document.querySelector(".join-form-button");

// 내용 자동입력
const recievedData = location.href.split("?")[1];
const userData = decodeURI(recievedData).split(",");
nameForValidation.value = userData[0];
username.value = userData[0];
email.value = userData[1];

function examineIdNumber(e) {
  const idNumValue = idNum.value.trim();
  e.preventDefault();
  if (idNumValue.length === 0) {
    alert("주민번호를 입력해주세요.");
    return;
  }
  if (!isIdNum(idNumValue)) {
    alert(
      "주민번호 형식에 맞지 않는 입력값입니다.\n######-####### 형식으로 입력해주세요."
    );
    return;
  }
  if (isAdult(idNumValue)) {
    alert("성인 인증에 성공했습니다.");
    main_form.style.display = "flex";
    return;
  } else {
    alert("미성년자는 가입 불가능합니다.");
    return;
  }
}

function checkPassword(password, passwordCheck) {
  if ((password == "") | (passwordCheck == "")) {
    alert("비밀번호를 입력해주세요.");
    return;
  } else if (password !== passwordCheck) {
    alert("비밀번호 확인 값이 일치하지 않습니다.");
    return;
  }
  return true;
}

function checkAddress(address, detailedAddress) {
  if (address == "" || detailedAddress == "") {
    alert("주소를 기입해주세요.");
    return false;
  }
  return true;
}

function checkPhoneNumber(phoneNumber) {
  if (phoneNumber.length === 0) {
    alert("휴대폰 번호를 입력해주세요.");
    return;
  } else if (!isNum(phoneNumber)) {
    alert("숫자만 입력 가능합니다.");
    return;
  }
  return true;
}

async function submitUserInfo(userInfoObj) {
  try {
    await api.post("/api/user/register", userInfoObj);
    alert("회원가입이 완료되었습니다 🎉");
    window.location.href = "/login";
  } catch (err) {
    alert(err.message);
  }
}

function requestToCompleteJoin() {
  const inputEmail = email.value;
  const inputName = username.value;
  const inputPassword = password.value;
  const inputPasswordCheck = passwordCheck.value;
  const inputPhoneNumber = phoneNumber.value;
  const inputAddress = address.value;
  const inputDetailedAddress = addressDetail.value;
  const userInputObj = {
    email: inputEmail,
    fullName: inputName,
    password: inputPassword,
    phoneNumber: inputPhoneNumber,
    address: {
      address1: inputAddress,
      address2: inputDetailedAddress,
    },
  };

  if (
    checkPassword(inputPassword, inputPasswordCheck) &&
    checkPhoneNumber(inputPhoneNumber) &&
    checkAddress(inputAddress, inputDetailedAddress)
  ) {
    submitUserInfo(userInputObj);
  }
}

adultcheckBtn.addEventListener("click", examineIdNumber);
joinCompletedBtn.addEventListener("click", requestToCompleteJoin);
