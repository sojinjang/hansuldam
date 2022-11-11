import { getFooter } from './footer/footer.js';
import { getHeader, redirectPage } from './header/header.js';

const main = document.querySelector(".body-container");

main.insertAdjacentHTML('beforebegin', getHeader());
main.insertAdjacentHTML('afterend', getFooter());

redirectPage();