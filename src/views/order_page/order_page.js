const $ = (seletor) => document.querySelector(seletor);

const PRODUCTS_KEY = "products";
function getSavedProducts() {
  return JSON.parse(localStorage.getItem(PRODUCTS_KEY));
}
let savedProducts = getSavedProducts();
console.log(savedProducts);

function showProduct(item) {
  let product = undefined;
  product = document.createElement("div");
  product.setAttribute("class", "order-product");
  product.setAttribute("id", item._id);
  product.innerHTML = `<div class="thumbnail">
    <img class="product-img" src="../img/redmonkey.jpeg" />
    <div>
        <p class="product-brand">${item.brand}</p>
        <p class="product-name">${item.name}</p>
        <p class="product-volume">${item.volume}ml</p>
    </div>
    
</div>
<div class="product-info">
    <p class="product-quantity">${parseInt(item.quantity)}개</p>
    <p class="product-price">${(item.price * item.quantity).toLocaleString(
      "ko-KR"
    )}원</p>
</div>`;
  $(".add-product").append(product);
}

savedProducts.forEach(showProduct);

function getPureDigit(numStr) {
  const regex = /[^0-9]/g;
  return parseInt(numStr.replace(regex, ""));
}

function getListsPrice() {
  const priceSelect = document.querySelectorAll(".product-price");
  let totalPrice = 0;
  let priceArr = [];
  for (let i = 0; i < priceSelect.length; i++) {
    priceArr.push(priceSelect.item(i).innerHTML);
  }
  priceArr.forEach((v) => {
    totalPrice += getPureDigit(v);
  });
  $(".total-product-price").innerText = `${totalPrice.toLocaleString(
    "ko-KR"
  )}원`;
  return totalPrice;
}

function getDeliveryFee() {
  let deliveryPay = 0;
  getListsPrice() >= 50000 ? (deliveryPay = 0) : (deliveryPay = 3000);
  $(".delivery-fee").innerText = `${deliveryPay.toLocaleString("ko-KR")}원`;
  return deliveryPay;
}

function caculateTotalPrice() {
  const productsPrice = getListsPrice();
  const deliveryFee = getDeliveryFee();
  $(".total-payment-price").innerText = `${(
    productsPrice + deliveryFee
  ).toLocaleString("ko-KR")}원`;
  return productsPrice + deliveryFee;
}

caculateTotalPrice();

$(".creditCardBtn").addEventListener("click", function (e) {
  e.preventDefault();
  $(".creditCard").style.display = "block";
});

// 임시 사용자 데이터
const userData = {
  fullName: "김뫄뫄",
  phoneNumber: "01012341234",
  email: "elice.test.com",
  address: {
    postalCode: "44123",
    address1: "ㅇㅇ시 ㅇㅇ구 ㅇㅇ동",
    address2: "ㅇㅇ아파트 101동 101호",
  },
};

// 주문자, 배송정보
$(".user-name").innerHTML = userData.fullName;
$(".user-phoneNumber").innerHTML = userData.phoneNumber;
$(".user-PostalCode").innerHTML = userData.address.postalCode;
$(".user-address1").innerHTML = userData.address.address1;
$(".user-address2").innerHTML = userData.address.address2;

$("#select-status").addEventListener("change", showInput);

function showInput(e) {
  const type = e.target.value;

  if (type === "direct") {
    $("#input-hide").style.display = "flex";
  } else {
    $("#input-hide").style.display = "none";
  }
}

const priceSum = caculateTotalPrice();

const res = JSON.parse(localStorage.getItem("products"));

const productsInOrder = res.map((item) => ({
  _id: item._id,
  quantity: item.quantity,
}));

// 유저정보 api요청하기

// db에 담을 데이터
const orderData = {
  fullName: userData.fullName,
  phoneNumber: userData.phoneNumber,
  address: {
    postalCode: userData.address.postalCode,
    address1: userData.address.address1,
    address2: userData.address.address2,
  },
  status: "상품준비중",
  priceSum: priceSum,
  productsInOrder: productsInOrder,
};

// 결제 버튼 눌렀을 때
const paymentBtn = $("#rounded-button");

paymentBtn.addEventListener("click", payOrder);

function payOrder(e) {
  e.preventDefault();
  const select = $("#select-status").value;
  if ($(".add-product").children.length == 0) {
    alert("주문 목록이 없습니다!");
    return;
  }
  if (select === "0") {
    alert("배송 시 요청사항을 선택해주세요!");
    return;
  }
  // 카드입력 내용 조건 걸기
  if (
    $("#input1").innerHTML == "" &&
    $("#input2").innerHTML == "" &&
    $("#input3").innerHTML == "" &&
    $("#input4").innerHTML == ""
  ) {
    alert("카드 입력칸을 다시 확인해주세요!");
    return;
  }
  console.log("hi");
  // 주문내용들 api로 post 보내기
  // 주문 완료 페이지로 이동하기
  //window.location.href()
}
