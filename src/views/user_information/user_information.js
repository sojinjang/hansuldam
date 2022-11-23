import { openPasswordPage, changePassword } from "./change_password.js";
import { openPhoneNumberPage, changePhoneNumber } from "./change_phoneNumber.js";
import { openAddressPage, changeAddress, insertFoundAddress } from "./change_address.js";
import * as api from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";

const $ = (selector) => document.querySelector(selector);
const pwChangeBtn = document.querySelector(".pwChangeBtn");
const pwConfirmBtn = document.querySelector(".pwConfirmBtn");
const adChangeBtn = document.querySelector(".adChangeBtn");
const adConfrimBtn = document.querySelector(".adConfrimBtn");
const numChangeBtn = document.querySelector(".numChangeBtn");
const numConfirmBtn = document.querySelector(".numConfirmBtn");
const userData = await api.get(ApiUrl.USER_INFORMATION);
const findAddressBtn = document.querySelector(".find-address-button");

$("#user-name").innerHTML = userData.fullName;
$("#user-email").innerHTML = userData.email;
$("#user-phoneNumber-number").innerHTML = userData.phoneNumber;
$("#user-postalCode").innerHTML = userData.address.postalCode;
$("#user-address1").innerHTML = userData.address.address1;
$("#user-address2").innerHTML = userData.address.address2;

pwChangeBtn.addEventListener("click", openPasswordPage);

pwConfirmBtn.addEventListener("click", changePassword);

numChangeBtn.addEventListener("click", openPhoneNumberPage);

numConfirmBtn.addEventListener("click", changePhoneNumber);

adChangeBtn.addEventListener("click", openAddressPage);

findAddressBtn.addEventListener("click", insertFoundAddress);

adConfrimBtn.addEventListener("click", changeAddress);

$(".delete-user-information-btn").addEventListener("click", deleteUserInformation);

async function deleteUserInformation(e) {
  e.preventDefault();
  try {
    if (confirm("정말 탈퇴하시겠습니까?")) {
      await api.delete(ApiUrl.USER_INFORMATION);
      deleteCookie(Keys.TOKEN_KEY);
      alert("성공적으로 탈퇴되셨습니다.");
      window.location.href = "/";
    }
  } catch (e) {
    alert("문제가 발생했습니다. 다시 시도해주세요");
  }
}
