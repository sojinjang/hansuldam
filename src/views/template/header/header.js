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
            <svg xmlns="http://www.w3.org/2000/svg" style="display:none">
              <symbol xmlns="http://www.w3.org/2000/svg" id="sbx-icon-search-13" viewBox="0 0 40 40">
                <path d="M25.54 28.188c-2.686 2.115-6.075 3.376-9.758 3.376C7.066 31.564 0 24.498 0 15.782 0 7.066 7.066 0 15.782 0c8.716 0 15.782 7.066 15.782 15.782 0 4.22-1.656 8.052-4.353 10.884l1.752 1.75 1.06-1.06L40 37.332l-3.72 3.72-9.977-9.976 1.062-1.062-1.826-1.826zm-9.758.746c7.264 0 13.152-5.888 13.152-13.152 0-7.263-5.888-13.152-13.152-13.152C8.52 2.63 2.63 8.52 2.63 15.782c0 7.264 5.89 13.152 13.152 13.152z"
                fill-rule="evenodd" />
              </symbol>
              <symbol xmlns="http://www.w3.org/2000/svg" id="sbx-icon-clear-2" viewBox="0 0 20 20">
                <path d="M8.96 10L.52 1.562 0 1.042 1.04 0l.522.52L10 8.96 18.438.52l.52-.52L20 1.04l-.52.522L11.04 10l8.44 8.438.52.52L18.96 20l-.522-.52L10 11.04l-8.438 8.44-.52.52L0 18.96l.52-.522L8.96 10z" fill-rule="evenodd" />
              </symbol>
            </svg>

            <form novalidate="novalidate" onsubmit="return false;" class="searchbox sbx-medium">
              <div role="search" class="sbx-medium__wrapper">
                <input type="search" name="search" placeholder="" autocomplete="off" required="required" class="sbx-medium__input search-bar">
                <button type="submit" class="sbx-medium__submit search-img">
                  <svg role="img" aria-label="Search">
                    <use xlink:href="#sbx-icon-search-13"></use>
                  </svg>
                </button>
                <button type="reset" title="Clear the search query." class="sbx-medium__reset">
                  <svg role="img" aria-label="Reset">
                    <use xlink:href="#sbx-icon-clear-2"></use>
                  </svg>
                </button>
              </div>
            </form>
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
      $(".user-list").innerHTML = `<li class="admin">관리자페이지</li>
<span class="separator">/</span>
<li class="logout">로그아웃</li>
<span class="separator">/</span>
<div class="basket">
  <img src="../img/shopping-bag.png" alt="cart-img">
</div>`;

      $(".admin").addEventListener("click", () => (window.location.href = "/admin"));
      handleLogout();
    } else {
      $(".user-list").innerHTML = `<li class="myPage">마이페이지</li>
<span class="separator">/</span>
<li class="logout">로그아웃</li>
<span class="separator">/</span>
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
    deleteCookie(Keys.USER_ID_KEY);
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
