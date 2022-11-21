import { openPasswordPage, changePassword } from "./change_password.js";
import {
  openPhoneNumberPage,
  changePhoneNumber,
} from "./change_phoneNumber.js";
import { openAddressPage, changeAddress, insertFoundAddress } from "./change_address.js";
import { get } from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";

const $ = (selector) => document.querySelector(selector);
const pwChangeBtn = document.querySelector(".pwChangeBtn");
const pwConfirmBtn = document.querySelector(".pwConfirmBtn");
const adChangeBtn = document.querySelector(".adChangeBtn");
const adConfrimBtn = document.querySelector(".adConfrimBtn");
const numChangeBtn = document.querySelector(".numChangeBtn");
const numConfirmBtn = document.querySelector(".numConfirmBtn");
const userData = await get(ApiUrl.USER_INFORMATION);
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
