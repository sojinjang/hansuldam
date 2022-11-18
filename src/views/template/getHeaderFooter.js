import { getFooter } from "./footer/footer.js";
import { getHeader, redirectPage } from "./header/header.js";
import { setCookie } from "../utils/cookie.js";
import { Keys } from "../constants/Keys.js";

const main = document.querySelector(".body-container");

const currentUrl = window.location.href;

main.insertAdjacentHTML("beforebegin", getHeader());
main.insertAdjacentHTML("afterend", getFooter());
if (currentUrl.includes(Keys.NAVER_TOKEN_KEY)) {
  const token = currentUrl.split(Keys.NAVER_TOKEN_KEY)[1].slice(1);
  setCookie(Keys.TOKEN_KEY, { [Keys.TOKEN_KEY]: token });
  getCartInfoFromDB();
}

redirectPage();
