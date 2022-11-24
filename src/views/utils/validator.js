function isName(name) {
  return /^[가-힣]{2,4}/.test(name);
}

function isNum(numStr) {
  return /^[0-9]+$/.test(numStr);
}

function isValidEmail(emailiInput) {
  const emailRegExp =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  return emailRegExp.test(emailiInput);
}

function isValidPassword(passwordInput) {
  return passwordInput.length > 3;
}

function isIdNum(idNumInput) {
  const idRegExp = /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-4][0-9]{6}$/;
  return idRegExp.test(idNumInput);
}

function isAdult(idNumInput) {
  //  input: ######-#######
  const curDateObj = new Date();
  const curYear = curDateObj.getFullYear();
  const genType = idNumInput.slice(7, 8);
  let age = 0;
  if (genType <= 2) {
    age = curYear - (1900 + parseInt(idNumInput.slice(0, 2)));
  } else {
    age = curYear - (2000 + parseInt(idNumInput.slice(0, 2)));
  }
  return age < 20 ? false : true;
}

function isCardNum(cardNumInput) {
  const cardRegExp = /[0-9]{4}/;
  return cardRegExp.test(cardNumInput);
}

function isValidComment(reviewInput) {
  return reviewInput.length >= 10;
}

export {
  isName,
  isNum,
  isValidEmail,
  isValidPassword,
  isIdNum,
  isAdult,
  isCardNum,
  isValidComment,
};
