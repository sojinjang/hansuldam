import { patch } from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";
import { findAddress } from "../utils/findAddress.js";

const adChangeBox = document.querySelector("#change-address-container");
const userPostalCode = document.querySelector("#user-postalCode");
const userAddress1 = document.querySelector("#user-address1");
const userAddress2 = document.querySelector("#user-address2");
const changePostalCode = document.querySelector(".changePostalCode");
const changeAddress1 = document.querySelector(".changeAddress1");
const changeAddress2 = document.querySelector(".changeAddress2");

export function openAddressPage(e) {
  e.preventDefault();

  adChangeBox.style.display = "flex";
}

export async function insertFoundAddress() {
  const { foundZoneCode, foundAddress } = await findAddress();
  changePostalCode.value = foundZoneCode;
  changeAddress1.value = foundAddress;
}

export async function changeAddress(e) {
  e.preventDefault();

  const address = {
    address: {
      postalCode: changePostalCode.value,
      address1: changeAddress1.value,
      address2: changeAddress2.value,
    },
  };

  if (
    changePostalCode.value == userPostalCode.innerHTML &&
    changeAddress1.value == userAddress1.innerHTML &&
    changeAddress2.value == userAddress2.innerHTML
  ) {
    alert("주소를 다시 확인해주세요");
    return;
  }
  if (
    changePostalCode.value == "" ||
    changeAddress1.value == "" ||
    changeAddress2.value == ""
  ) {
    alert("주소를 입력해주세요");
    return;
  }

  try {
    await patch(ApiUrl.USER_INFORMATION, "", address);
    alert("주소가 성공적으로 변경되었습니다🎉");
    userPostalCode.innerHTML = changePostalCode.value;
    userAddress1.innerHTML = changeAddress1.value;
    userAddress2.innerHTML = changeAddress2.value;
    adChangeBox.style.display = "none";
  } catch (e) {
    alert(e.message);
  }
}
