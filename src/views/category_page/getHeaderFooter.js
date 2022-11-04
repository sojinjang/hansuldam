import footer from "../template/footer/footer.js";
import header from "../template/header/header.js";

const main = document.querySelector(".body-container");

main.insertAdjacentHTML("beforebegin", header());
main.insertAdjacentHTML("afterend", footer());