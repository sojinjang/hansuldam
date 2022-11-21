const { userModel } = require("../src/db");
const bcrypt = require("bcrypt");

async function user() {
  const userDatas = [
    {
      email: "richman@elice.com",
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
      email: "admin@elice.com",
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
  ];
  try {
    await userModel.setTestdata(userDatas);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { user };
