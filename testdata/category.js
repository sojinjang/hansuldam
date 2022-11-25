const { categoryModel } = require("../src/db");

async function category() {
  const categoryDatas = [
    { name: "선물하기 좋은술" },
    { name: "방방곡곡 전국여행" },
    { name: "캠핑엔 막걸리" },
    { name: "한여름밤의 하이볼" },
    { name: "2022 우리술품평회 수상작" },
    { name: "없음" },
  ];
  try {
    await categoryModel.setTestdata(categoryDatas);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { category };
