
import footer from '../template/footer/footer.js';


const body = document.querySelector(".body-container");
const main_form = document.querySelector(".body-join-form");
const ageInput = document.querySelector("#userAgeInput");
let nameInput = document.querySelector("#userNameInput");
const checkBtn = document.querySelector(".adultCheckButton");
let email = document.querySelector("#email");
let name = document.querySelector("#nameInput");
const password = document.querySelector("#passwordInput");
const passwordCheck = document.querySelector("#passwordCheck");
const addressPostalCode = document.querySelector("#addressPostalCode");
const addressLocation = document.querySelector("#addressLocation");
const addressDetail = document.querySelector("#addressDetail");
const phoneNumber = document.querySelector("#phoneNumber");
const joinPassBtn = document.querySelector(".join-form-button");

const receivedData = location.href.split('?')[1]; 
const userData = decodeURI(receivedData).split(",");

name.value = userData[0];
email.value = userData[1];
nameInput.value = userData[0];

body.insertAdjacentHTML("afterend", footer());

// 성인인증하기 버튼 이벤트 리스너
checkBtn.addEventListener("click", OpenjoinPage);

function OpenjoinPage(e) {
    e.preventDefault(); 
    // 이 코드가 있으면 이름(nameInput)의 input 타입이 적용되지 않고, 이 코드가 없으면 input이 적용되지만 새로고침이 되버림

    this.onclick = null;
    const ageinput = ageInput.value;

    function isName(name) {
        if(name !== "") {
            return true;
        }
        if(name == "") {
            return false;
        }
    }

    function isAdult(ageinput) {
        const twenty = 20;

        if (Number(ageinput) >= twenty) {
            return true;
        }
        return false;  
    }

    if(isAdult(ageinput) && isName(nameInput.value)) {
        alert("인증 성공하셨습니다.")
        main_form.style.display = "flex";
        return;
    }
    if(ageInput.value == "") {
        alert("나이를 입력해주세요")
        return;
    }
    if (!isAdult(ageinput)) {
        alert("미성년자는 가입 불가입니다.")
        //window.location.href="http://127.0.0.1:5500/src/views/home/home.html?%22"
    }
}

// 가입 완료 버튼 이벤트리스너
joinPassBtn.addEventListener("click", successJoin);

function successJoin() {

    const inputName = name.value;
    const inputPassword = password.value;
    const inputPasswordCheck = passwordCheck.value;
    const inputAddressPostalCode = addressPostalCode.value;
    const inputAddressLocation = addressLocation.value;
    const inputAddressDetail = addressDetail.vaule;
    const inputPhoneNumber = phoneNumber.value;
    
    function checkPassword(password){
        if(password == inputPassword && password !== "") {
            return true;
        }
        if(password == ""){
            return false;
        }
        if(password !== inputPassword) {
            console.log("비밀번호가 일치하지 않습니다.")
            return false;
        }
    }

    function checkAddress(address, address1, address2){
        if(address == "" || address1 == "" || address2 == "") {
            return false;
        } else {
            return true;
        }
    }

    function checkPhonNumber(phoneNumber) {
        if(phoneNumber == "") {
            return false;
        } else {
            return true;
        }
    }

    function checkTotal(password, address, address1, address2, phoneNumber) {
        if(checkPassword(password) && checkAddress(address, address1, address2) && checkPhonNumber(phoneNumber)) {
            console.log("가입성공!")
            window.location.href="http://127.0.0.1:5500/src/views/home/home.html?%22";
            return true;
        } else {
            console.log("입력칸을 다시 확인해주세요");
        }
    }

    checkTotal(inputPasswordCheck, inputAddressPostalCode, inputAddressLocation, inputAddressDetail, inputPhoneNumber);
    

    const userInputData = {
        fullName: inputName,
        password: inputPassword,
        address: {
            PostalCode: inputAddressPostalCode,
            address1: inputAddressLocation,
            address2: inputAddressDetail,
        },
        phoneNumber: inputPhoneNumber,
    };
    //const res = await fetch("api주소");
    JSON.stringify(userInputData);
}

