const { userModel } = require("../src/db");
const bcrypt = require("bcrypt");

async function user() {
  const userDatas = [
    {
      email: "richman@google.com",
      fullName: "임고객",
      password: await bcrypt.hash("00000000", 10),
      phoneNumber: "01012341234",
      address: {
        postalCode: "26412",
        address1: "이마저도 역시 이렇구 전통주로 4길 5",
        address2: "500호",
      },
      role: "basic-user",
    },
    {
      email: "admin@google.com",
      fullName: "노숙취",
      password: await bcrypt.hash("11111111", 10),
      phoneNumber: "01012341234",
      address: {
        postalCode: "53354",
        address1: "이마저도 역시 이렇구 전통주로 4길 5",
        address2: "1004호",
      },
      role: "admin",
    },
    {
      email: "han@google.com",
      fullName: "한소희",
      password: await bcrypt.hash("11111111", 10),
      phoneNumber: "01012341234",
      address: {
        postalCode: "53354",
        address1: "전라북도 전주시 어딘가",
        address2: "여기",
      },
      role: "admin",
    },
    {
      email: "DJmaster@google.com",
      fullName: "DJ Kim",
      password: await bcrypt.hash("11111111", 10),
      phoneNumber: "01012341234",
      address: {
        postalCode: "53354",
        address1: "경기도 어딥니까 태권동",
        address2: "발차기",
      },
      role: "admin",
    },
    {
      email: "jian@google.com",
      fullName: "지안",
      password: await bcrypt.hash("11111111", 10),
      phoneNumber: "01012341234",
      address: {
        postalCode: "53354",
        address1: "서울특별시 잭콕 그정돈 1샷",
        address2: "숙취",
      },
      role: "admin",
    },
    {
      email: "jw@google.com",
      fullName: "이재우우웅",
      password: await bcrypt.hash("11111111", 10),
      phoneNumber: "01012341234",
      address: {
        postalCode: "53354",
        address1: "부산 댄스 신동",
        address2: "1004호",
      },
      role: "admin",
    },
    {
      email: "sojin@google.com",
      fullName: "장팀장",
      password: await bcrypt.hash("11111111", 10),
      phoneNumber: "01012341234",
      address: {
        postalCode: "53354",
        address1: "부산 크럼프",
        address2: "1짱",
      },
      role: "admin",
    },
  ];
  try {
    await userModel.setTestdata(userDatas);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { user };
