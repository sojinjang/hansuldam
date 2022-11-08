const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");
const loginBtn = document.querySelector("#submitButton");

loginBtn.addEventListener("click", handleSubmit);

async function handleSubmit(e){
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;
  const emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  // 임시 데이터
  const data = {
    email: "elice@test.com",
    password: 1234
  }
  

  // 이메일 입력할 때 유효성 검사하기
  // 이메일을 형식에 맞게 잘 입력했는지?

  if(email.match(emailRegExp) == null) {
    alert("이메일 형식을 다시 확인해주세요.")
    return;
  }

  if(password.length < 4) {
    alert("비밀번호 4자리 이상 입력해주세요")
    return;
  }

  const inputData = {
    email: email,
    password: password
  };

  try {
    const result = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputData),
    });
  
    const { token } = result;
  
    sessionStorage.setItem("token", token);
  } catch(err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);

  }
  
  var n = sessionStorage.getItem("token");
  console.log(n);
  console.log(token);


  // const { token } = result;
    
  // SessionStorage.setItem("token", token);
    
    // 토큰을 쿠키에 저장
}

// 회원가입 버튼을 눌렀을 때 버튼 태그에 링크 걸어둠
// 비밀번호 찾기 버튼 눌렀을 때 버튼 태그에 링크 걸어둠