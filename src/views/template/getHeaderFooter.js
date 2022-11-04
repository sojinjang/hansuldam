import footer from "./footer/footer.js";
import header from "./header/header.js";

const main = document.querySelector(".body-container");

main.insertAdjacentHTML("beforebegin", header());
main.insertAdjacentHTML("afterend", footer());