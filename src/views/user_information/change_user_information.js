import { get, patch } from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";
import { findAddress } from "../utils/findAddress.js";
import { deleteCookie } from "../utils/cookie.js";
import { Keys } from "../constants/Keys.js";
import { resetCart } from "../utils/localStorage.js";

const $ = (selector) => document.querySelector(selector);

try {
  await get(ApiUrl.USER_INFORMATION);
} catch (err) {
  window.location.href = "/";
  alert(err.message);
}

function openPhoneNumberPage(e) {
  e.preventDefault();

  $("#change-phoneNumber-container").style.display = "flex";
}

async function changePhoneNumber(e) {
  e.preventDefault();
  const phoneNumber = {
    phoneNumber: $(".changePhoneNumber").value,
  };
  const regExp = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})[0-9]{3,4}[0-9]{4}$/;
  // 새로운 전화번호를 입력했을 때
  if (
    $(".changePhoneNumber").value == "" ||
    $(".changePhoneNumber").value.match(regExp) == null
  ) {
    alert("전화번호를 정확히 입력해주세요.");
    return;
  }

  if ($(".changePhoneNumber").value == $("#user-phoneNumber-number").innerHTML) {
    alert("전화번호를 다르게 입력해주세요.");
    return;
  }

  try {
    await patch(ApiUrl.USER_INFORMATION, "", phoneNumber);
    alert("전화번호가 변경되었습니다🎉");
    $("#user-phoneNumber-number").innerHTML = $(".changePhoneNumber").value;
    $("#change-phoneNumber-container").style.display = "none";
  } catch (e) {
    console.log(e.message);
  }
}

function openAddressPage(e) {
  e.preventDefault();

  $("#change-address-container").style.display = "flex";
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
    $(".changePostalCode").value == $("#user-postalCode").innerHTML &&
    $(".changeAddress1").value == $("#user-address1").innerHTML &&
    $(".changeAddress2").value == $("#user-address2").innerHTML
  ) {
    alert("주소를 다시 확인해주세요");
    return;
  }
  if (
    $(".changePostalCode").value == "" ||
    $(".changeAddress1").value == "" ||
    $(".changeAddress2").value == ""
  ) {
    alert("주소를 입력해주세요");
    return;
  }

  try {
    await patch(ApiUrl.USER_INFORMATION, "", address);
    alert("주소가 성공적으로 변경되었습니다🎉");
    $("#user-postalCode").innerHTML = $(".changePostalCode").value;
    $("#user-address1").innerHTML = $(".changeAddress1").value;
    $("#user-address2").innerHTML = $(".changeAddress2").value;
    $("#change-address-container").style.display = "none";
  } catch (e) {
    alert(e.message);
  }
}

function openPasswordPage(e) {
  e.preventDefault();

  $("#change-password-container").style.display = "flex";
}

async function changePassword(e) {
  e.preventDefault();

  const userData = await get(ApiUrl.USER_INFORMATION);

  if ($(".changePassword").value == "" || $(".changePasswordCheck").value == "") {
    alert("비밀번호 입력칸을 확인해주세요.");
    return;
  }
  if ($(".changePassword").value !== $(".changePasswordCheck").value) {
    alert("새로운 비밀번호가 일치하지 않습니다.");
    return;
  }

  const newPassword = {
    password: userData.password,
    newPassword: $(".changePassword").value,
  };

  try {
    await patch(ApiUrl.USER_INFORMATION, "", newPassword);
    console.log("비밀번호가 변경되었습니다🎉");
    $("#change-password-container").style.display = "none";
  } catch (e) {
    alert(e.message);
  }
}

async function deleteUserInformation(e) {
  e.preventDefault();
  try {
    if (confirm("정말 탈퇴하시겠습니까?")) {
      await api.delete(ApiUrl.USER_INFORMATION);
      resetCart(Keys.CART_KEY);
      deleteCookie(Keys.TOKEN_KEY);
      alert("성공적으로 탈퇴되셨습니다.");
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
};
