import { Router } from "express";
import request from "request";
import { userService } from "../services";
import { BadRequest } from "../utils/errorCodes";

const naverRouter = Router();

const HSD_url = `http://localhost:${PORT}`;
var client_id = process.env.Naver_clientID;
var client_secret = process.env.Naver_clientSecret;
var state = "RAMDOM_STATE";
var redirectURI = encodeURI(`${HSD_url}/api/naver/callback`);
var naverApiUrl = ``;

let token = ``;
let authUserId = ``;

naverRouter.get("/login", (req, res) => {
  naverApiUrl =
    "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" +
    client_id +
    "&redirect_uri=" +
    redirectURI +
    "&state=" +
    state;

  res.status(200).json({ naverApiUrl });
});

naverRouter.get("/callback", (req, res) => {
  const code = req.query.code;
  const state = req.query.state;
  naverApiUrl =
    "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=" +
    client_id +
    "&client_secret=" +
    client_secret +
    "&redirect_uri=" +
    redirectURI +
    "&code=" +
    code +
    "&state=" +
    state;

  var options = {
    url: naverApiUrl,
    headers: {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    },
  };

  request.get(options, async (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const { access_token } = JSON.parse(body);
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
          const auth = true;
          const fullName = result.response.nickname;
          const email = result.response.email;
          const phoneNumber = result.response.mobile.split("-").join("");
          const password = "naver";
          const naverUserInfo = { auth, fullName, email, phoneNumber, password };

          const authUser = await userService.OauthLogin(naverUserInfo);

          token = authUser.token;
          authUserId = authUser.userId;

          res.redirect("/?valid=" + authUserId);
        }
      );
    } else {
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode);
    }
  });
});

naverRouter.get("/:userId", (req, res, next) => {
  const { userId } = req.params;

  if (userId === authUserId.toString()) {
    res.status(200).json({ token, userId });
  } else {
    next(new BadRequest("Incorrect Request user-id", 4701));
  }
});

export { naverRouter };
