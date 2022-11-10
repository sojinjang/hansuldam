import { Router } from "express";
import request from "request";

const naverRouter = Router();

var client_id = process.env.Naver_clientID;
var client_secret = process.env.Naver_clientSecret;
var state = "RAMDOM_STATE";
var redirectURI = encodeURI("http://localhost:7777/api/naver/callback");
var api_url = "http://localhost:7777";

naverRouter.get("/naverlogin", function (req, res) {
  api_url =
    "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" +
    client_id +
    "&redirect_uri=" +
    redirectURI +
    "&state=" +
    state;
  res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
  res.end(
    "<a href='" +
      api_url +
      "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>"
  );
});

naverRouter.get("/callback", function (req, res) {
  const code = req.query.code;
  const state = req.query.state;
  api_url =
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
    url: api_url,
    headers: {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    },
  };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
      const { access_token } = JSON.parse(body);

      // const userToken = naverService(access_token);
      console.log(access_token);
      res.status(200).json();
    } else {
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode);
    }
  });
  res.redirect("/");
});

export { naverRouter };
