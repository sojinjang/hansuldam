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
            <li class="login">로그인</li>
            <li class="join">회원가입</li>
            <div class="basket">
              <img src="../img/shopping-bag.png" alt="cart-img">
            </div>
          </ul>
        </section>
      </div>
      <div class="header-menu-wrapper">
        <ul class="menu-list">
          <li>
            <div class="menu-label"><a class="products">전체상품</a></div>
          </li>
          <li>
            <div class="menu-label"><a>신상품</a></div>
          </li>
          <li>
            <div class="menu-label"><a>베스트</a></div>
          </li>
          <li>
            <div class="menu-label"><a>밀키트</a></div>
          </li>
        </ul>
      </div>
    </header>`;
}

function redirectPage() {
  const companyLogo = document.querySelector(".company-logo");
  const login = document.querySelector(".login");
  const join = document.querySelector(".join");
  const cart = document.querySelector(".basket");
  const products = document.querySelector(".products");

  companyLogo.addEventListener("click", () => (window.location.href = "/"));
  login.addEventListener("click", () => (window.location.href = "/login"));
  join.addEventListener("click", () => (window.location.href = "/join"));
  cart.addEventListener("click", () => (window.location.href = "/join"));
  products.addEventListener("click", () => (window.location.href = "/products"));
}

export { getHeader, redirectPage };
