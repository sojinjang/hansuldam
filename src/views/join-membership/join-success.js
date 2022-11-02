
import footer from "../template/footer/footer.js";

const body = document.querySelector(".body-container");
const main_form = document.querySelector(".body-join-form");
const numberInput = document.querySelector("#userNumberInput");
const emailInput = document.querySelector("#emailInput");
const checkBtn = document.querySelector(".checkBtn");
const name = document.querySelector("#nameInput");
const password = document.querySelector("#passwordInput");
const passwordCheck = document.querySelector("#passwordCheck");
const addressCode = document.querySelector(".addressCode");
const addressLocation = document.querySelector(".addressLocation");
const addressDetail = document.querySelector(".addressDetail");
const phoneNumber = document.querySelector("#phoneNumber");
const joinPassBtn = document.querySelector(".join-form-button");

body.insertAdjacentHTML("afterend", footer());

// 성인인증하기 버튼 이벤트 리스너
checkBtn.addEventListener("click", joinPage);

function joinPage (e) {
    e.preventDefault();
    this.onclick = null;
    //main 태그에 인증완료시 나오는 엘리먼트 삽입하기
    // if (main_form.style.display == "none"){
    // } 왜 안되냐!!!!
    main_form.style.display = "flex";
}

// 생년월일로 만나이 계산하기
const dateObj = new Date(); // 날짜 Object 생성
const age = 0; // 나이
const yy = dateObj.getFullYear(); // 현재년도
const mm = dateObj.getMonth() + 1; // 현재월
const dd = dateObj.getDate(); // 현재일



// 인증 실패
//if(numberInput.value )
// 인증 완료

// 상세 페이지 이메일 형식 확인

//이메일 정규식 체크 함수
// function email_check(email) {
// 	let reg_email = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

//     if(!reg_email.test(str)) {                            
//         return false;         
//         }else {                       
//         return true;         
//         }
// }

// function checkIt() {
//     let email = emailInput.value
//     let exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

//     if(exptext.test(email) == false) {

//         //이메일 형식이 알파벳+숫자@알파벳+숫자.알파벳+숫자 형식이 아닐경우			

//         alert("이메일형식이 올바르지 않습니다.");

//         return false;
//     }
// }



// 가입 완료 버튼 이벤트리스너
joinPassBtn.addEventListener("click", joinSuccess);

function joinSuccess(e) {
    e.preventDefault();

    const InputName = name.value;
    const InputPassword = password.value;
    const InputPasswordCheck = passwordCheck.value;
    //const InputAddressCode = addressCode.value;
    const InputAddressLocation = addressLocation;
    const InputAddressDetail = addressDetail;
    const InputPhoneNumber = phoneNumber.value;

    //const res = await fetch("api주소");

    // 이메일 형식이 맞는지
    function verifyEmail() {
        // 이메일 검증 스크립트 작성
        let emailVal = emailInput.value;
    
        var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        // 검증에 사용할 정규식 변수 regExp에 저장
        
        if (emailVal.match(regExp) != null) {
            alert('Good!');
        }
        else {
            alert('Error');
        }
    };

    verifyEmail();
    // 중복 이메일이 아닌지


    // 비밀번호와 비밀먼호 확인이 일치하는지
    if(InputPassword !== res.password){
        alert("비밀번호가 일치하지 않습니다.")
    }

    // 입력한 값을 res.json형태로 db로 보낸다.
    const userInputData = {InputName, InputPassword, InputPasswordCheck, InputAddressCode, InputAddressLocation, InputAddressDetail, InputPhoneNumber};
    JSON.stringify(userInputData);
}

