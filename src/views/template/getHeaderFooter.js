import { getFooter } from "./footer/footer.js";
import { getHeader, redirectPage } from "./header/header.js";
import { setCookie } from "../utils/cookie.js";
import { Keys } from "../constants/Keys.js";
import { getCartInfoFromDB } from "../utils/cart.js";
import * as api from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";

const main = document.querySelector(".body-container");

const currentUrl = window.location.href;

main.insertAdjacentHTML("beforebegin", getHeader());
main.insertAdjacentHTML("afterend", getFooter());

async function logInByLogin(userId) {
  try {
    const response = await api.get(ApiUrl.NAVER_OAUTH, userId);
    setCookie(Keys.TOKEN_KEY, { [Keys.TOKEN_KEY]: response.token });
    setCookie(Keys.USER_ID_KEY, { [Keys.USER_ID_KEY]: response.userId });
    getCartInfoFromDB();
  } catch (err) {
    alert(err.message);
  }
}

if (currentUrl.includes(Keys.NAVER_KEY)) {
  await logInByLogin(currentUrl.split(Keys.NAVER_KEY)[1].slice(1));
}

redirectPage();
