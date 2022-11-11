const { productModel } = require("../src/db");
const { categoryService } = require("../src/services");

async function product() {
  const productDatas = [
    {
      name: "솔송주 약주",
      price: 18000,
      category: "선물하기 좋은술",
      image: "#",
      stock: 100,
      brand: "솔송주",
      description: "함양의 깨끗한 이슬을 머금은 솔송주",
      volume: 700,
      sales: 10,
      alcoholType: "약주",
      alcoholDegree: 13,
      manufacturedDate: "2022-06-07",
    },
    {
      name: "서천 한산소곡주",
      price: 39000,
      category: "선물하기 좋은술",
      image: "#",
      stock: 100,
      brand: "우희열한산소곡주",
      description: "우리땅 처음술",
      volume: 1800,
      sales: 10,
      alcoholType: "약주",
      alcoholDegree: 18,
      manufacturedDate: "2022-06-07",
    },
    {
      name: "진도 홍주",
      price: 25000,
      category: "선물하기 좋은술",
      image: "#",
      stock: 200,
      brand: "대대로영농조합",
      description: "진도쌀과 지초로 빚고 3년 숙성한 홍주",
      volume: 375,
      sales: 12,
      alcoholType: "리큐르",
      alcoholDegree: 38,
      manufacturedDate: "2022-05-17",
    },
    {
      name: "선운산 복분자주",
      price: 8300,
      category: "방방곡곡 전국여행",
      image: "#",
      stock: 75,
      brand: "선운산복분자주흥진",
      description: "양질의 복분자로 빚은 건강 발효주",
      volume: 375,
      sales: 55,
      alcoholType: "과실주",
      alcoholDegree: 16,
      manufacturedDate: "2021-11-12",
    },
    {
      name: "서울의 밤",
      price: 7900,
      category: "방방곡곡 전국여행",
      image: "#",
      stock: 50,
      brand: "더한",
      description: "황매실로 만든 프리미엄 매실주",
      volume: 375,
      sales: 55,
      alcoholType: "증류주",
      alcoholDegree: 25,
      manufacturedDate: "2021-11-12",
    },
    {
      name: "강냉이 막걸리",
      price: 7900,
      category: "캠핑엔 막걸리",
      image: "#",
      stock: 150,
      brand: "용두산조은술",
      description: "맑은물로 빚은 전통의 명주",
      volume: 1000,
      sales: 13,
      alcoholType: "탁주",
      alcoholDegree: 6,
      manufacturedDate: "2020-06-22",
    },
    {
      name: "명품안동소주",
      price: 9000,
      category: "한여름밤의 하이볼",
      image: "#",
      stock: 50,
      brand: "명품안동소주",
      description: "프리미엄 소주 안동소주일품",
      volume: 375,
      sales: 3,
      alcoholType: "증류주",
      alcoholDegree: 19.8,
      manufacturedDate: "2021-11-12",
    },
    {
      name: "유채꽃, 제주",
      price: 12000,
      category: "방방곡곡 전국여행",
      image: "#",
      stock: 70,
      brand: "제주본초",
      description: "지역의 전통과 역사를 이어가는 바람에 산들산들 유채꽃,제주",
      volume: 365,
      sales: 7,
      alcoholType: "기타주류",
      alcoholDegree: 16,
      manufacturedDate: "2021-11-12",
    },
  ];

  try {
    const products = await productModel.setTestdata(productDatas);
    await Promise.all(
      products.map(async (cur) => {
        const filterObj = { name: cur.category };
        const curId = cur._id.toString();
        const toUpdate = { $push: { products: curId } };
        await categoryService.updateCategory(filterObj, toUpdate);
      })
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = { product };
