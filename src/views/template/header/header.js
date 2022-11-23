import { get } from "../../api.js";
import { deleteCookie, getCookieValue } from "../../utils/cookie.js";
import { getSavedItems, resetCart } from "../../utils/localStorage.js";
import { updateCartInfoToDB } from "../../utils/cart.js";
import { Keys } from "../../constants/Keys.js";
import { ApiUrl } from "../../constants/ApiUrl.js";

const $ = (selector) => document.querySelector(selector);

function getHeader() {
  return `<header> 
      <div class="header-container">
        <section class="navigation-menu">
          <div class="company-logo-wrapper">
            <img class="company-logo" src="../img/logo.png" alt="company-logo">
          </div>
          <div class="search-container">
            <img class="search-img" src="../img/search-icon.png" alt="search-logo">
            <input class="input is-rounded search-bar" type="text" placeholder="제품검색" />
          </div>
        </section>
        <section class="user-menu">
          <ul class="user-list">
            <li class="login">로그인 |</li>
            <li class="join">회원가입</li>
            <div class="basket">
              <img src="../img/shopping-bag.png" alt="cart-img">
            </div>
          </ul>
        </section>
      </div>
      <div class="header-menu-wrapper">
        <ul class="menu-list">
          <li class="menu-label" id="totalProducts">
            <a class="products">전체상품</a>
          </li>
          <li class="menu-label" id="newProducts">
            <a>신상품</a>
          </li>
          <li class="menu-label" id="bestProducts">
            <a>베스트</a>
          </li>
          <li class="menu-event-label" id="eventProducts">
            <a>기획전</a>
          </li>
        </ul>
      </div>
    </header>`;
}

async function redirectPage() {
  const menuLabels = document.querySelectorAll(".menu-label");

  $(".company-logo").addEventListener("click", () => (window.location.href = "/"));
  $(".search-img").addEventListener("click", handleSearch);
  $(".join").addEventListener("click", () => (window.location.href = "/join"));
  $(".login").addEventListener("click", () => {
    window.location.href = "/login";
  });
  if (getCookieValue(Keys.TOKEN_KEY)) {
    const user = await get(ApiUrl.USER_INFORMATION);
    if (user && user["role"] === "admin") {
      $(".user-list").innerHTML = `<li class="admin">관리자페이지 |</li>
<li class="logout">로그아웃</li>
<div class="basket">
  <img src="../img/shopping-bag.png" alt="cart-img">
</div>`;

      $(".admin").addEventListener("click", () => (window.location.href = "/admin"));
      handleLogout();
    } else {
      $(".user-list").innerHTML = `<li class="myPage">마이페이지 |</li>
<li class="logout">로그아웃</li>
<div class="basket">
  <img src="../img/shopping-bag.png" alt="cart-img">
</div>`;

      $(".myPage").addEventListener("click", () => (window.location.href = "/myPage"));
      handleLogout();
    }
  }

  $(".basket").addEventListener("click", () => (window.location.href = "/cart"));
  $("#eventProducts").addEventListener("click", () => (window.location.href = "/event-page"));
  menuLabels.forEach((label) => {
    label.addEventListener("click", (e) => {
      const labelId = e.currentTarget.getAttribute("id");
      window.location.href = `/products?label=${labelId}`;
    });
  });
}

function handleLogout() {
  $(".logout").addEventListener("click", () => {
    const cartItems = getSavedItems(Keys.CART_KEY);
    updateCartInfoToDB(cartItems);
    resetCart(Keys.CART_KEY);
    deleteCookie(Keys.TOKEN_KEY);
    setTimeout(() => {
      window.location.href = "/";
    }, 50);
  });
}

function handleSearch(e){
  e.preventDefault();
  const input = $(".input");
  const query = input.value;
  window.location.href = `/search/?keyword=${query}`;
}

export { getHeader, redirectPage };
