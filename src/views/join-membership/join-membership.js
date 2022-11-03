import footer from "../template/footer/footer.js";

const body = document.querySelector(".body-container");
const name = document.querySelector("#nameInput");
const email = document.querySelector("#emailInput");
const joinBtn = document.querySelector(".join-form-button");



body.insertAdjacentHTML("afterend", footer());


joinBtn.addEventListener("click", joinEvent);

function joinEvent(e){
    e.preventDefault();
    // 입력받은 값을 {key:value} 형태로 만들어주기
    
    const data = { name: name.value, email: email.value };

    // 중복 이메일이 아닌지

    // 이메일 형식 맞는지
    function verifyEmail() {
        // 이메일 검증 스크립트 작성
        let emailVal = email.value;
    
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

    // 입력받은 값을 json형태로 바꿔줌
    JSON.stringify(data);

    // db에 넣어주기
}




