import * as api from "../api.js";
import { changeToKoreanTime } from "../utils/useful_functions.js";

const orderNum = document.querySelector(".num");
const orderDate = document.querySelector(".date");
const username = document.querySelector(".name");
const phoneNumber = document.querySelector(".phoneNumber");
const address = document.querySelector(".address");
const cardType = document.querySelector(".cardType");
const cardNumber = document.querySelector(".cardNumber");
const totalPrice = document.querySelector(".totalPrice");

const orderId = decodeURI(location.href.split("?")[1]);

async function getOrderInfo() {
  try {
    const orderInfoObj = await api.get(`/api/orders/${orderId}`);
    return orderInfoObj;
  } catch (err) {
    alert(err.message);
  }
}

async function writeOrderInfo() {
  const orderInfoObj = await getOrderInfo();
  orderNum.innerText = "주문번호: " + orderInfoObj["_id"];
  orderDate.innerText = "주문일자: " + changeToKoreanTime(orderInfoObj["createdAt"]);
  username.innerText = orderInfoObj["fullName"];
  phoneNumber.innerText = orderInfoObj["phoneNumber"];
  address.innerText =
    orderInfoObj["address"]["address1"] + orderInfoObj["address"]["address2"];
  cardType.innerText = orderInfoObj["payment"]["detail"] + "카드";
  cardNumber.innerText = orderInfoObj["payment"]["number"];
  totalPrice.innerText = `${orderInfoObj["totalPrice"].toLocaleString("ko-KR")}원`;
}

window.addEventListener("load", writeOrderInfo);
