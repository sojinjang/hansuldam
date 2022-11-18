import { openPasswordPage, changePassword } from "./change_password.js";
import {
  openPhoneNumberPage,
  changePhoneNumber,
} from "./change_phoneNumber.js";
import { openAddressPage, changeAddress } from "./change_address.js";
import { get } from "../api.js";

const $ = (selector) => document.querySelector(selector);
const pwChangeBtn = document.querySelector(".pwChangeBtn");
const pwConfirmBtn = document.querySelector(".pwConfirmBtn");
const adChangeBtn = document.querySelector(".adChangeBtn");
const adConfrimBtn = document.querySelector(".adConfrimBtn");
const numChangeBtn = document.querySelector(".numChangeBtn");
const numConfirmBtn = document.querySelector(".numConfirmBtn");

// db에서 데이터 가져오기
const userData = await get("/api/auth", "user");

// 개인정보공간에 사용자 정보 등록하기
$("#user-name").innerHTML = userData.fullName;
$("#user-email").innerHTML = userData.email;
$("#user-phoneNumber-number").innerHTML = userData.phoneNumber;
$("#user-address1").innerHTML = userData.address.address1;
$("#user-address2").innerHTML = userData.address.address2;

pwChangeBtn.addEventListener("click", openPasswordPage);

pwConfirmBtn.addEventListener("click", changePassword);

numChangeBtn.addEventListener("click", openPhoneNumberPage);

numConfirmBtn.addEventListener("click", changePhoneNumber);

adChangeBtn.addEventListener("click", openAddressPage);

adConfrimBtn.addEventListener("click", changeAddress);
