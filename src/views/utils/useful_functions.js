function changeToKoreanTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString("ko-KR");
}

export { changeToKoreanTime };
