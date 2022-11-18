import { patch } from "../api.js";

const adChangeBox = document.querySelector("#change-address-container");
const userAddress1 = document.querySelector("#user-address1");
const userAddress2 = document.querySelector("#user-address2");
const changeAddress1 = document.querySelector(".changeAddress1");
const changeAddress2 = document.querySelector(".changeAddress2");

export function openAddressPage(e) {
  e.preventDefault();

  adChangeBox.style.display = "flex";
}

export async function changeAddress(e) {
  e.preventDefault();

  const address = {
    address: {
      address1: changeAddress1.value,
      address2: changeAddress2.value,
    },
  };

  if (
    changeAddress1.value == userAddress1.innerHTML &&
    changeAddress2.value == userAddress2.innerHTML
  ) {
    alert("주소를 다르게 입력하세요.");
    return;
  }
  if (changeAddress1.value == "" || changeAddress2.value == "") {
    alert("주소를 입력해주세요");
    return;
  }

  try {
    await patch("/api/auth", "user", address);
    alert("주소 변경이 완료되었습니다.");
    userAddress1.innerHTML = changeAddress1.value;
    userAddress2.innerHTML = changeAddress2.value;
    adChangeBox.style.display = "none";
  } catch (e) {
    alert("문제가 발생했습니다. 다시 확인해주세요.");
  }
}
