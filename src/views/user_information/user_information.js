import {
  openPasswordPage,
  changePassword,
  openPhoneNumberPage,
  changePhoneNumber,
  openAddressPage,
  changeAddress,
  insertFoundAddress,
  deleteUserInformation,
  cancelChangeAddress,
  cancelChangePassword,
  cancelChangePhoneNumber,
} from "./change_user_information.js";
import * as api from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";

const $ = (selector) => document.querySelector(selector);
const userData = await api.get(ApiUrl.USER_INFORMATION);

$("#user-name").innerHTML = userData.fullName;
$("#user-email").innerHTML = userData.email;
$("#user-phoneNumber-number").innerHTML = userData.phoneNumber;
$("#user-postalCode").innerHTML = userData.address.postalCode;
$("#user-address1").innerHTML = userData.address.address1;
$("#user-address2").innerHTML = userData.address.address2;

$(".pwChangeBtn").addEventListener("click", openPasswordPage);
$(".pwConfirmBtn").addEventListener("click", changePassword);
$(".pwCancelBtn").addEventListener("click", cancelChangePassword);

$(".numChangeBtn").addEventListener("click", openPhoneNumberPage);
$(".numConfirmBtn").addEventListener("click", changePhoneNumber);
$(".numCancelBtn").addEventListener("click", cancelChangePhoneNumber);

$(".adChangeBtn").addEventListener("click", openAddressPage);
$(".find-address-button").addEventListener("click", insertFoundAddress);
$(".adConfrimBtn").addEventListener("click", changeAddress);
$(".adCancelBtn").addEventListener("click", cancelChangeAddress);

$(".delete-user-information-btn").addEventListener("click", deleteUserInformation);
