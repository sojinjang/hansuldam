import footer from "../template/footer/footer.js";
//import * as Api from "/api.js";

const body = document.querySelector(".body-container");
const nameInput = document.querySelector("#nameInput");
const emailInput = document.querySelector("#emailInput");
const joinBtn = document.querySelector(".join-form-button");
const overlabBtn = document.querySelector(".emailOverlap");

// const successUserInfo = [];
// function pushUserInfo() {
//     let email = emailInput.value;
//     let name = emailInput.value;
//     successUserInfo.push(email);
//     successUserInfo.push(name);
// }
// pushUserInfo();


body.insertAdjacentHTML("afterend", footer());

joinBtn.addEventListener("click", joinCheck)

overlabBtn.addEventListener("click", checkOverlab)

let tempStatus = true;

function checkOverlab() {

    const emailinput = emailInput.value;
    const emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    function 중복체크(emailinput) {
        const data = ["elice@test.com"]; // 임시 데이터
    
        if(data.includes(emailinput) == true || emailinput == "") {
            return true;
        }
        return false;
    }
    
    if(emailinput == "") {
        alert("이메일을 입력하세요.")
        return;
    }
    if(중복체크(emailinput)) {
        alert("이미 사용중인 이메일입니다.")
        tempStatus = false;
        return;
    }
    if(emailinput.match(emailRegExp) == null) {
        alert("이메일 형식을 다시 확인해주세요.")
        tempStatus = false;
        return;
    }
    if(!중복체크(emailinput)) {
        alert("사용 가능합니다!")
        tempStatus = true;
        return;
    }

}

function joinCheck(e) {
    e.preventDefault();
    
    if(nameInput.value.length <= 1) {
        alert("이름은 두 글자 이상 입력해야 합니다.")
        return;
    }
    if(!tempStatus || nameInput.value == "" ) {
        alert("입력창을 다시 확인하세요.");
        return;
    }
    if(tempStatus){
        const successUserInfo = [nameInput.value, emailInput.value]
        location.href = `join-success.html?${successUserInfo}`;
    }
}



