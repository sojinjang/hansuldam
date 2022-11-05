import footer from "./footer/footer.js";
import { getHeader, log } from './header/header.js';

const main = document.querySelector(".body-container");

main.insertAdjacentHTML('beforebegin', getHeader());
main.insertAdjacentHTML("afterend", footer());

log();