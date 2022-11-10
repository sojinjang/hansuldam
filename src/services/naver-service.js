import request from "request";
import bcrypt from "bcrypt";
import { userModel } from "../db";

async function naverService(access_token) {
  request.get(
    {
      url: "https://openapi.naver.com/v1/nid/me",
      headers: {
        "Content-Type": "text/json;charset=utf-8",
        Authorization: `Bearer ${access_token}`,
      },
    },
    async function (error, response, body) {
      const result = JSON.parse(body);
      if (!result.message == "success") {
        throw new Error("네이버 로그인 실패");
      }
      const fullName = result.response.nickname;
      const email = result.response.email;
      const phoneNumber = result.response.mobile.split("-").join("");

      const password = await bcrypt.hash("naver", 10);
      const naverUserInfo = { fullName, email, phoneNumber, password };

      let naverUser = await userModel.findByEmail(email);
      console.log(naverUser);
      if (!naverUser) {
        naverUser = await userModel.create(naverUserInfo);
      }

      return naverUser;
    }
  );
}

export { naverService };
