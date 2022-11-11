import { getFooter } from "./footer/footer.js";
import { getHeader, redirectPage } from "./header/header.js";
import { setCookie } from "../utils/cookie.js";

const main = document.querySelector(".body-container");

const currentUrl = window.location.href;
const TOKEN = "token";
const NAVER_TOKEN_KEY = "valid";

main.insertAdjacentHTML("beforebegin", getHeader());
main.insertAdjacentHTML("afterend", getFooter());

if (currentUrl.includes(NAVER_TOKEN_KEY)) {
  const token = currentUrl.split(NAVER_TOKEN_KEY)[1].slice(1);
  setCookie(TOKEN, { [TOKEN]: token });
}

redirectPage();
