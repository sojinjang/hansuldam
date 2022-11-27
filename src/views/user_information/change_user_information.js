import * as api from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";
import { findAddress } from "../utils/findAddress.js";
import { deleteCookie } from "../utils/cookie.js";
import { Keys } from "../constants/Keys.js";
import { resetCart } from "../utils/localStorage.js";
import { isNum } from "../utils/validator.js";

const $ = (selector) => document.querySelector(selector);

try {
  await api.get(ApiUrl.USER_INFORMATION);
} catch (err) {
  window.location.href = "/";
  alert(err.message);
}

function openPhoneNumberPage(e) {
  e.preventDefault();

  $("#change-phoneNumber-container").style.display = "flex";
  $("#phoneNumber-btn-container").style.display = "flex";
  $(".numChangeBtn").style.display = "none";
}

async function changePhoneNumber(e) {
  e.preventDefault();
  const phoneNumber = {
    phoneNumber: $(".changePhoneNumber").value,
  };

  if ($(".changePhoneNumber").value == "") {
    alert("휴대폰 번호를 입력해주세요 📱");
    return;
  } else if (!isNum(phoneNumber)) {
    alert("숫자만 입력 가능합니다 🔢");
    return;
  } else if ($(".changePhoneNumber").value == $("#user-phoneNumber-number").innerHTML) {
    alert("휴대폰 번호를 다르게 입력해주세요 📱");
    return;
  }

  try {
    await api.patch(ApiUrl.USER_INFORMATION, "", phoneNumber);
    alert("휴대폰 번호가 변경되었습니다 🎉");
    $("#user-phoneNumber-number").innerHTML = $(".changePhoneNumber").value;
    $("#change-phoneNumber-container").style.display = "none";
    $("#phoneNumber-btn-container").style.display = "none";
    $(".numChangeBtn").style.display = "block";
  } catch (e) {
    alert(e.message);
  }
}

function cancelChangePhoneNumber() {
  $("#change-phoneNumber-container").style.display = "none";
  $("#phoneNumber-btn-container").style.display = "none";
  $(".numChangeBtn").style.display = "block";
}

function openAddressPage(e) {
  e.preventDefault();

  $("#change-address-container").style.display = "flex";
  $("#address-btn-container").style.display = "flex";
  $(".adChangeBtn").style.display = "none";
}

async function insertFoundAddress() {
  const { foundZoneCode, foundAddress } = await findAddress();
  $(".changePostalCode").value = foundZoneCode;
  $(".changeAddress1").value = foundAddress;
}

async function changeAddress(e) {
  e.preventDefault();

  const address = {
    address: {
      postalCode: $(".changePostalCode").value,
      address1: $(".changeAddress1").value,
      address2: $(".changeAddress2").value,
    },
  };

  if (
    $(".changePostalCode").value == "" ||
    $(".changeAddress1").value == "" ||
    $(".changeAddress2").value == ""
  ) {
    alert("주소를 기입해주세요 🏠");
    return;
  }

  try {
    await api.patch(ApiUrl.USER_INFORMATION, "", address);
    alert("주소가 성공적으로 변경되었습니다 🎉");
    $("#user-postalCode").innerHTML = $(".changePostalCode").value;
    $("#user-address1").innerHTML = $(".changeAddress1").value;
    $("#user-address2").innerHTML = $(".changeAddress2").value;
    $("#change-address-container").style.display = "none";
    $("#address-btn-container").style.display = "none";
    $(".adChangeBtn").style.display = "block";
  } catch (e) {
    alert(e.message);
  }
}

function cancelChangeAddress() {
  $("#change-address-container").style.display = "none";
  $("#address-btn-container").style.display = "none";
  $(".adChangeBtn").style.display = "block";
}

function openPasswordPage(e) {
  e.preventDefault();

  $("#change-password-container").style.display = "flex";
  $("#password-btn-container").style.display = "flex";
  $(".pwChangeBtn").style.display = "none";
}

async function changePassword(e) {
  e.preventDefault();

  const userData = await api.get(ApiUrl.USER_INFORMATION);

  if ($(".changePassword").value == "" || $(".changePasswordCheck").value == "") {
    alert("비밀번호를 입력해주세요 📛");
    return;
  }
  if ($(".changePassword").value !== $(".changePasswordCheck").value) {
    alert("새로 입력한 비밀번호가 일치하지 않습니다 ❌");
    return;
  }

  const newPassword = {
    password: userData.password,
    newPassword: $(".changePassword").value,
  };

  try {
    await api.patch(ApiUrl.USER_INFORMATION, "", newPassword);
    alert("비밀번호가 변경되었습니다 🎉");
    $("#change-password-container").style.display = "none";
    $("#password-btn-container").style.display = "none";
    $(".pwChangeBtn").style.display = "block";
  } catch (e) {
    alert(e.message);
  }
}

function cancelChangePassword() {
  $("#change-password-container").style.display = "none";
  $("#password-btn-container").style.display = "none";
  $(".pwChangeBtn").style.display = "block";
}

async function deleteUserInformation(e) {
  e.preventDefault();
  try {
    if (confirm("정말 탈퇴하시겠습니까?")) {
      await api.delete(ApiUrl.USER_INFORMATION);
      resetCart(Keys.CART_KEY);
      deleteCookie(Keys.TOKEN_KEY);
      deleteCookie(Keys.USER_ID_KEY);
      alert("성공적으로 탈퇴되셨습니다 😔");
      window.location.href = "/";
    }
  } catch (e) {
    alert(e.message);
  }
}

export {
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
};
