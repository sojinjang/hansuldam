import { get } from "../../api.js";
import { deleteCookie, getCookieValue } from "../../utils/cookie.js";
import { getSavedItems, resetCart } from "../../utils/localStorage.js";
import { updateCartInfoToDB } from "../../utils/cart.js";
import { Keys } from "../../constants/Keys.js";
import { ApiUrl } from "../../constants/ApiUrl.js";

const $ = (selector) => document.querySelector(selector);

function getHeader() {
  return `
<header> 
  <div class="header-top-container">
    <img class="company-logo" src="../img/logo.jpeg" alt="company-logo">
  </div>
  <div class="header-container">
    <section class="user-menu">
      <ul class="user-list">
        <li class="myPage">비회원 주문 조회</li>
        <span class="separator">/</span>
        <li class="login">로그인</li>
        <span class="separator">/</span>
        <li class="join">회원가입</li>
        <div class="cart">
          <span class="cart-count">0</span>
          <img src="../img/shopping-bag.png" alt="cart-img">
        </div>
      </ul>
    </section>
  </div>
  <div class="header-menu-wrapper">
    <ul class="menu-list">
      <li class="menu-label" id="totalProducts">
        <a>전체상품</a>
      </li>
      <li class="menu-label" id="newProducts">
        <a>신상품</a>
      </li>
      <li class="menu-label" id="bestProducts">
        <a>베스트</a>
      </li>
      <li class="menu-event-label menu-label" id="eventProducts">
        <a>기획전</a>
      </li>
      <li class="search-wrapper">
        <button class="search-button">
          <img src="../img/search-icon.png" alt="검색" />
        </button>
      </li>
    </ul>
  </div>
</header>`;
}

async function redirectPage() {
  const menuLabels = document.querySelectorAll(".menu-label");

  menuLabels.forEach((label) => {
    label.addEventListener("click", (e) => {
      const labelId = e.currentTarget.getAttribute("id");
      window.location.href = `/products?label=${labelId}&page=1`;
    });
  });

  $(".company-logo").addEventListener("click", () => (window.location.href = "/"));
  $(".search-button").addEventListener("click", () => appendSearchModal());
  $(".join").addEventListener("click", () => (window.location.href = "/join"));
  $(".login").addEventListener("click", () => (window.location.href = "/login"));
  $(".myPage").addEventListener("click", () => (window.location.href = "/myPage"));
  $(".cart").addEventListener("click", () => (window.location.href = "/cart"));
  $("#eventProducts").addEventListener("click", () => (window.location.href = "/event-page"));

  if (getCookieValue(Keys.TOKEN_KEY)) {
    const user = await get(ApiUrl.USER_INFORMATION);

    user["role"] === "admin" ? loginAsAdmin() : loginAsUser();
    $(".cart").addEventListener("click", () => (window.location.href = "/cart"));
    $(".myPage").addEventListener("click", () => (window.location.href = "/myPage"));
    handleLogout();
  }

  updateCartCount();
}

function loginAsUser() {
  $(".user-list").innerHTML = `<li class="myPage">마이페이지</li>
<span class="separator">/</span>
<li class="logout">로그아웃</li>
<div class="cart">
  <span class="cart-count">0</span>
  <img src="../img/shopping-bag.png" alt="cart-img">
</div>`;
}

function loginAsAdmin() {
  $(".user-list").innerHTML = `<li class="myPage">마이페이지</li>
<span class="separator">/</span>
<li class="admin">관리자페이지</li>
<span class="separator">/</span>
<li class="logout">로그아웃</li>
<div class="cart">
  <span class="cart-count">0</span>
  <img src="../img/shopping-bag.png" alt="cart-img">
</div>`;

  $(".admin").addEventListener("click", () => (window.location.href = "/admin"));
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

function updateCartCount() {
  const cartLength = getSavedItems(Keys.CART_KEY);

  $(".cart-count").innerHTML = cartLength.length;
}

function appendSearchModal() {
  const searchModalHTML = `
<div class="modal">
  <div class="search-container">
    <div class="search-input-wrapper">
      <input class="search-input" placeholder="검색어를 입력하세요." />
    </div>
    <img class="search-icon" src="../img/search-icon.png" alt="검색" />
  </div>
  <button class="modal-close-button">X</button>
</div>
`;
  $("body").insertAdjacentHTML("beforebegin", searchModalHTML);

  const searchInputWrapper = document.querySelector(".search-input-wrapper");
  const modal = document.querySelector(".modal");
  const searchIcon = document.querySelector(".search-icon");

  (function handleSearchFadeIn() {
    setTimeout(() => {
      modal.style.opacity = 1;
      searchInputWrapper.style.borderBottom = "1.5px solid var(--black-400)";
      searchInputWrapper.style.opacity = 1;
      searchIcon.style.transform = "translateX(0px)";
    }, 50);
  })();

  (function handleCloseSearchWithESC() {
    window.onkeydown = (e) => {
      if (e.keyCode === 27 && modal) {
        modal.remove();
      }
    };
  })();

  $(".modal-close-button").addEventListener("click", () => modal.remove());
  $(".search-input").addEventListener("keydown", handleSearchWithEnter);
  searchIcon.addEventListener("click", handleSearchWithClick);
}

function handleSearchWithClick(e) {
  e.preventDefault();
  const input = $(".search-input");
  const inputValue = input.value.trim();
  inputValue === ""
    ? alert("검색어를 입력해주세요.")
    : (window.location.href = `/search/?keyword=${inputValue}&page=1`);
}

function handleSearchWithEnter(e) {
  const inputValue = e.target.value.trim();

  if (e.keyCode === 13) {
    inputValue === ""
      ? alert("검색어를 입력해주세요.")
      : (window.location.href = `/search/?keyword=${inputValue}&page=1`);
  }
}

async function handleHambergurMenu() {
  const hambergurHTML = `
<div class="cart">
  <span class="cart-count">0</span>
  <img src="../img/shopping-bag.png" alt="cart-img">
</div>
<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>
  <div class="navbar-menu">
    <section class="user-menu">
      <ul class="user-list">
        <li class="myPage">비회원 주문 조회</li>
        <li class="login">로그인</li>
        <li class="join">회원가입</li>
      </ul>
    </section>
  </div>
</nav>
`;

  $(".user-menu").remove();
  $(".header-container").innerHTML = hambergurHTML;

  $(".navbar-burger").addEventListener("click", () => {
    $(".navbar-menu").classList.toggle("is-active");
    $(".navbar-burger").classList.toggle("is-active");
  });

  redirectPage();
}

function handleUserMenu() {
  const usemenuHTML = `
<section class="user-menu">
  <ul class="user-list">
    <li class="myPage">비회원 주문 조회</li>
    <span class="separator">/</span>
    <li class="login">로그인</li>
    <span class="separator">/</span>
    <li class="join">회원가입</li>
    <div class="cart">
      <span class="cart-count">0</span>
      <img src="../img/shopping-bag.png" alt="cart-img">
    </div>
  </ul>
</section>
`;

  $(".navbar").remove();
  $(".header-container").innerHTML = usemenuHTML;
  redirectPage();
}

window.addEventListener("resize", () => {
  let windowWidth = window.innerWidth;

  if (windowWidth < 875 && $(".user-menu")) {
    handleHambergurMenu();
  }

  if (windowWidth >= 875 && $(".navbar")) {
    handleUserMenu();
  }
});

window.onload = () => {
  if (window.innerWidth < 875 && $(".user-menu")) {
    handleHambergurMenu();
  }
};

export { getHeader, redirectPage, updateCartCount };
