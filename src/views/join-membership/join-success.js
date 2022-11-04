
import footer from "../template/footer/footer.js";

const body = document.querySelector(".body-container");
const main_form = document.querySelector(".body-join-form");
const ageInput = document.querySelector("#userAgeInput");
let nameInput = document.querySelector("#userNameInput");
const checkBtn = document.querySelector(".adultCheckButton");
const email = document.querySelector("#email");
let name = document.querySelector("#nameInput");
const password = document.querySelector("#passwordInput");
const passwordCheck = document.querySelector("#passwordCheck");
const addressPostalCode = document.querySelector("#addressPostalCode");
const addressLocation = document.querySelector("#addressLocation");
const addressDetail = document.querySelector("#addressDetail");
const phoneNumber = document.querySelector("#phoneNumber");
const joinPassBtn = document.querySelector(".join-form-button");

const receivedData = location.href.split('?')[1];
console.log(receivedData);

body.insertAdjacentHTML("afterend", footer());

// 성인인증하기 버튼 이벤트 리스너
checkBtn.addEventListener("click", OpenjoinPage);

function OpenjoinPage() {

    this.onclick = null;
    const ageinput = ageInput.value;


    function isAdult(ageinput) {
        const twenty = 20;

        if (Number(ageinput) >= twenty) {
            return true;
        }
        return false;  
    }

    if (isAdult(ageinput)) {
        alert("인증 성공하셨습니다.")
        main_form.style.display = "flex";
        return;
    }
    if (!isAdult(ageinput)) {
        alert("미성년자는 가입 불가입니다.")
        //window.location.href="http://127.0.0.1:5500/src/views/home/home.html?%22"
    }
}

// 인증 완료 시, 인증창의 이름, 이메일 속성을  가입 상세페이지의 이름, 이메일 속성으로 추가하기
// 약간 간편가입 페이지의 버튼 이벤트리스너에 넣어야 할 것 같음. 그렇다면 두 속성을 모두 간편가입 페이지에서 들고와야할듯
// 이메일 속성은 join-membership.html에서 가져와야함.
// 이름과, 이메일 속성 변수로 할당하기
// 이름 = "join-membership.html/#nameInput"
// 간편가입이름 = document.querySelector(join-membership.html/#nameInput).innerText
// 이메일 = "join-membership.html/#emailInput"
// 간편가입이메일 = document.querySelector(join-membership.html/#emailInput).innerText
// 간편 로그인 페이지에서 리스너가 실행되면 
// 두 dom요소의 속성값을 상세가입 페이지의 이름, 이메일 요소의 속성값으로 추가한다.



// 가입 완료 버튼 이벤트리스너
joinPassBtn.addEventListener("click", successJoin);

function successJoin(e) {
    e.preventDefault();

    const inputName = name.value;
    const inputPassword = password.value;
    const inputPasswordCheck = passwordCheck.value; // 변수랑 함수의 이름이 똑같음
    const inputAddressPostalCode = addressPostalCode.value;
    const inputAddressLocation = addressLocation.value;
    const inputAddressDetail = addressDetail.vaule;
    const inputPhoneNumber = phoneNumber.value;
    
    // 비밀번호와 비밀먼호 확인이 일치하는지
    function checkPassword(password){
        if(password == inputPassword) {
            return true;
        }
        if(password !== inputPassword) {
            console.log("비밀번호가 일치하지 않습니다.")
            return false;
        }
    }

    // 주소값 3곳 다 입력되어 있는지
    function checkAddress(address, address1, address2){
        if(address == "" || address1 == "" || address2 == "") {
            console.log("주소를 다 입력해주세요")
            return false;
        } else {
            return true;
        }
    }

    // 휴대폰번호 입력 했는지
    function checkPhonNumber(phoneNumber) {
        if(phoneNumber == "") {
            console.log("휴대폰 번호를 입력하세요");
            return false;
        } else {
            return true;
        }
    }

    // 회원가입 전체 정보가 다 확인 됐는지 확인
    function checkTotal(password, address, address1, address2, phoneNumber) {
        if(checkPassword(password) && checkAddress(address, address1, address2) && checkPhonNumber(phoneNumber)) {
            console.log("가입성공!")
            window.location.href="http://127.0.0.1:5500/src/views/home/home.html?%22";
            return true;
            
        } else {
            console.log("입력칸을 다시 확인해주세요")
        }
        console.log("작동이 되는가?")
    }

    checkTotal(inputPasswordCheck, inputAddressPostalCode, inputAddressLocation, inputAddressDetail, inputPhoneNumber);
    

    // 입력한 값을 res.json형태로 변환
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

