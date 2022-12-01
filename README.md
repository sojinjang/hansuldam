## 🍶 프로젝트 소개
<img src="https://user-images.githubusercontent.com/111125577/205091531-1dd8426d-ba7b-4ca2-afeb-eed0bbcbc7fc.jpeg" height="150"/>

한국의 전통주를 판매하는 사이트 한술담입니다.
<br/>
[서비스 링크 이동하기](http://ec2-43-201-84-245.ap-northeast-2.compute.amazonaws.com:5000)


## 🛠기술 스택

**프론트엔드**

<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">

**백엔드**

<img src="https://img.shields.io/badge/mongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white"> <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">

**기타**

<img src="https://img.shields.io/badge/amazonaws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white"> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"> <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">


## :runner: 로컬 실행 방법

1. 레포지토리를 클론하고자 하는 디렉토리에서 아래 명령어를 수행

   ```
   git clone "https://github.com/sojinjang/hansuldam"
   ```

2. 클론한 디렉토리에서 backend 디렉토리로 들어가 아래 명령어를 통해 backend에서 필요한 module 설치

   ```
   npm install
   ```

3. `.env` 설정

  ```
  MONGODB_URL=<개인 로컬 혹은 Atlas 서버 URL>
  PORT=5000
  JWT_SECERT_KEY=<랜덤 문자열>

  GMAIL_ID= "hansuldam@gmail.com"
  GMAIL_PASSWORD= "qyzriroefrrftjmy"

  Naver_clientID="s9FiQEn_oNjmniDng5pR"
  Naver_clientSecret= "TaweIapn6j"
  ```
4. express 앱을 실행
   ```
   npm run start
   ```
   
## 🪪 테스트 계정
- 일반 유저
   - ID: richman@google.com
   - PW: 00000000
- 관리자
   - ID: admin@google.com
   - PW: 11111111

## 🗺 프로젝트 구성도 
<img width="1161" alt="user_home" src="https://user-images.githubusercontent.com/111125577/205089755-7733dce3-cb18-4d2e-bf01-d1fd13f02907.png">
<img width="801" alt="admin_home" src="https://user-images.githubusercontent.com/111125577/205089791-5a0b9294-be37-4560-af81-0d10faeebff6.png">

## 👨‍👩‍👦‍👦 Contribution

| 이름 | 담당 업무 |
| ------ | ------ |
| 소진 | 팀장/프론트엔드 개발 |
| 재웅 | 프론트엔드 개발 |
| 지안 | 프론트엔드 개발 |
| 동준 | 백/프론트엔드 개발 |
| 상준 | 백엔드 개발 |

| 담당자명(GitHub) | 1차 구현 및 개선 담당 | 2차 구현 및 개선 담당 |
| --- | --- | --- |
| 소진 [@sojinjang](https://github.com/sojinjang) | 로그인/네이버 로그인 기능, 회원가입 기능, 장바구니 페이지, 결제 및 주문완료 페이지 | 회원 장바구니 기능, 장바구니 기능 개선, 후기 게시판 기능, 반응형 웹 적용 |
| 재웅 [@wooooooongs](https://github.com/wooooooongs) | 홈, 관리자 페이지, 상품 카테고리 페이지, 상품 상세 페이지, 헤더, 푸터 | multer 기반 이미지 업로드, 반응형 웹 적용, 페이지네이션 적용 |
| 지안 [@HelloJianii](https://github.com/HelloJianii) | 비밀번호 찾기 페이지, 주문내역 페이지, 마이페이지 | 반응형 웹 적용, 주문내역 페이지 기능개선(주문정보 보기, 주문취소, 우편번호 찾기 버튼), 비회원/회원 마이페이지 |
| 동준 [@dejaikeem](https://github.com/dejaikeem) | BE: 페이지네이션, Nodemailer 비밀번호 찾기 기능, erd 구조도, 서비스 흐름도 | FE: 다음 주소 검색 API, 키워드 검색 페이지, 홈 화면 주종 별 필터 페이지, 반응형 웹적용 |
| 상준 [@ahosang](https://github.com/ahosang) | API 설계 및 API 문서 작성, 오류코드 작성 및 문서화, 백엔드 3계층 구조 기반 설계 적용, 기본적인 데이터 모델 CRUD, 권한에 따른 서비스 인가 기능, JWT 토큰 방식 로그인, Auth 로그인 | 필터 및 검색기능, 리소스 개선 리팩토링, multer 기반 이미지 CRUD, AWS 배포 |

## 🗂 디렉토리 구조
<img width="667" alt="image" src="https://user-images.githubusercontent.com/111125577/205074551-e8909ffa-8f19-40a5-8089-30943256093d.png">
