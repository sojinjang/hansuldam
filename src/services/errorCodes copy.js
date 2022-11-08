// 요청오류는 4000번대

const UnknownError = {
  code: 1000,
  message: "Unknown error, please report us about it",
};

const DBError = { code: 5100, message: "DB Error" };
const AWSError = 5200;

// ------- 미들웨어 오류 : 4000
const NoAuth = {
  code: 4001,
  status: 403,
  message: "로그인한 유저만 사용할 수 있는 서비스입니다.",
};

const IncorrectToken = {
  code: 4002,
  status: 403,
  message: "정상적인 토큰이 아닙니다.",
};

const NoAdmin = {
  code: 4003,
  status: 403,
  message: "관리자 권한이 필요합니다.",
};
const EmptyObject = {
  code: 4004,
  status: 406,
  message: "headers의 Content-Type을 application/json으로 설정해주세요",
};

// ------- user 서비스오류: 4100
const NeedChangeEmail = {
  code: 4101,
  status: 400,
  message: "이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.",
};
const EmailNoInDB = {
  code: 4102,
  status: 404,
  message: "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.",
};
const PasswordError = {
  code: 4103,
  status: 401,
  message: "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.",
};
const NoInDB = {
  code: 4104,
  status: 404,
  message: "가입 내역이 없습니다. 다시 한 번 확인해 주세요.",
};

//--------product 서비스오류: 4200
const NeedChangeProductName = {
  code: 4201,
  status: 400,
  message: "같은 이름의 상품이 있습니다. 다시 확인해주세요",
};
const NeedAnotherProductName = {
  code: 4202,
  status: 400,
  message: "수정한 이름과 같은 이름의 상품이 있습니다. 다시 확인해주세요",
};
const ProductNoInDB = {
  code: 4203,
  status: 404,
  message: "일치하는 상품이 없습니다. 다시 한 번 확인해 주세요.",
};

//--------order 서비스오류: 4300
const CanNotChangeOrder = {
  code: 4302,
  status: 401,
  message: "상품준비중 상태가 아니라 주문을 수정할수 없습니다.",
};
const OrderNoInDB = {
  code: 4303,
  status: 404,
  message: "일치하는 주문 내역이 없습니다. 다시 한 번 확인해 주세요.",
};

//--------category 서비스오류: 4400
const NeedChangeCategoryName = {
  code: 4401,
  status: 400,
  message: "같은 이름의 카테고리가 있습니다. 다시 확인해주세요",
};
const NeedAnotherCategoryName = {
  code: 4402,
  status: 400,
  message: "수정한 이름과 같은 이름의 카테고리가 있습니다. 다시 확인해주세요",
};
const CategoryNoInDB = {
  code: 4403,
  status: 404,
  message: "일치하는 카테고리가 없습니다. 다시 한 번 확인해 주세요.",
};

export {
  UnknownError,
  ValidationError,
  SyntaxError,
  NoPermission,
  DBError,
  AWSError,
};
