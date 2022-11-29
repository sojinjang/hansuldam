const { productModel, userModel, commentModel } = require("../src/db");
const { sampleComment } = require("./sample-comment");
const { getRandomInt } = require("./get-random-int");
const path = require("path");

async function comment() {
  try {
    // 앞 상품 5개
    const products = await productModel.findAll(0, 6);
    const users = await userModel.findAll();
    let comments = sampleComment.map((ment) => {
      ment["productId"] = products[getRandomInt(0, 6)]._id;
      ment["userId"] = users[getRandomInt(0, users.length)]._id;
      return ment;
    });

    const fixedComments = await fixComment();
    comments = comments.concat(fixedComments);
    await commentModel.setTestdata(comments);
  } catch (error) {
    console.log(error);
  }
}

async function fixComment() {
  const saveRoute = path.join("src", "views", "img", "comments");
  const comments = [
    {
      productName: "고도리 복숭아 와인",
      image: path.join(saveRoute, "고도리복숭아와인후기.jpg"),
      content:
        "스파클링 + 달달한 복숭아 맛\n 상받았던 술이라고 해서 사봤는데 존맛\n도수 높은거 못드시는분 + 복숭아 좋아하시는분 무조건 드셔보세요:복숭아: ",
    },
    {
      productName: "서울의 밤",
      image: path.join(saveRoute, "서울의밤후기.jpg"),
      content:
        "온더락으로 마시기 좋은 술:유리잔:\n하이볼로 만들어서도 많이 드시는것 같더라구요\n달지 않은 술 좋아하시는 분들에게 추천드려요:반짝임:",
    },
    {
      productName: "황금 보리",
      image: path.join(saveRoute, "황금보리후기.jpg"),
      content:
        "보리향이 솔솔:벼_이삭:\n좋아하는 이자카야에 가져가서 먹었어요\n소주 특유의 역한 알콜향이 없어서 너무 좋습니다:결백:",
    },
    {
      productName: "우주멜론미",
      image: path.join(saveRoute, "우주멜론미.jpg"),
      content: "저기요.. 우쥬 멜론 미?",
    },
  ];

  const user = await userModel.findByEmail("sojin@elice.com");

  const fixedComments = await Promise.all(
    comments.map(async ({ productName, ...rest }) => {
      const newComment = { ...rest };
      const product = await productModel.findByObj({ name: productName });
      newComment.productId = product._id;
      newComment.userId = user._id;
      return newComment;
    })
  );

  return fixedComments;
}
module.exports = { comment };
