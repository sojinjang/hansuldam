function changeToKoreanTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString("ko-KR");
}

function changeToKoreanWon(price) {
  return Number(price).toLocaleString("ko-KR");
}

function getPureDigit(numStr) {
  const regex = /[^0-9]/g;
  return parseInt(numStr.replace(regex, ""));
}

export { changeToKoreanTime, changeToKoreanWon, getPureDigit };
