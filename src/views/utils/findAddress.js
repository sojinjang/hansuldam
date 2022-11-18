const findAddress = () => {
  return new Promise((result) => {
    new daum.Postcode({
      oncomplete: function (data) {
        let addr = "";
        let buildingName = data.buildingName ? ` (${data.buildingName})` : "";
        //주소 선택
        if (data.userSelectedType === "R") {
          // 도로명 주소
          addr = `${data.roadAddress}${buildingName}`;
        } else {
          // 지번 주소
          addr = `${data.jibunAddress}${buildingName}`;
        }

        // 우편번호
        const foundZoneCode = data.zonecode;
        // 도로명or지번
        const foundAddress = addr;
        result({ foundZoneCode, foundAddress });
      },
    }).open({ autoClose: true });
  });
};

export { findAddress };
