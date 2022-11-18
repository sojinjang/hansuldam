function changeToKoreanTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString("ko-KR");
}

function changeToKoreanWon(price) {
  return Number(price).toLocaleString("ko-KR");
}

export { changeToKoreanTime, changeToKoreanWon };
