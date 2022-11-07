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

function redirectPage() {
  const $ = selector => document.querySelector(selector);
  const menuLabels = document.querySelectorAll('.menu-label');

  $(".company-logo").addEventListener("click", () => (window.location.href = "/"));
  $(".login").addEventListener("click", () => (window.location.href = "/login"));
  $('.join').addEventListener("click", () => (window.location.href = "/join"));
  $('.basket').addEventListener("click", () => (window.location.href = "/cart"));
  $('#eventProducts').addEventListener('click', () => (window.location.href = '/event-page'));
  
  menuLabels.forEach((label) => {
    label.addEventListener('click', (e) => {
      const labelId = e.currentTarget.getAttribute('id');
      window.location.href = `/products?label=${labelId}`;
    });
  });
  
}

export { getHeader, redirectPage };
