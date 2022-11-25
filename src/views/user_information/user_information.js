import {
  openPasswordPage,
  changePassword,
  openPhoneNumberPage,
  changePhoneNumber,
  openAddressPage,
  changeAddress,
  insertFoundAddress,
  deleteUserInformation,
} from "./change_user_information.js";
import * as api from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";

const $ = (selector) => document.querySelector(selector);
const pwChangeBtn = document.querySelector(".pwChangeBtn");
const pwConfirmBtn = document.querySelector(".pwConfirmBtn");
const adChangeBtn = document.querySelector(".adChangeBtn");
const adConfrimBtn = document.querySelector(".adConfrimBtn");
const numChangeBtn = document.querySelector(".numChangeBtn");
const numConfirmBtn = document.querySelector(".numConfirmBtn");
const findAddressBtn = document.querySelector(".find-address-button");

const userData = await api.get(ApiUrl.USER_INFORMATION);

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
