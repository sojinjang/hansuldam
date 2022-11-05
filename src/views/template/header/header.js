function getHeader() {
  return `<header> 
      <div class="header-container">
        <section class="navigation-menu">
          <div class="company-logo-wrapper">
            <img class="company-logo" src="../img/logo.png">
          </div>
          <div class="search-container">
            <img class="search__img" src="../img/search-icon.png" alt="나는 돋보기">
            <input class="input is-rounded search__bar" type="text" placeholder="제품검색" />
          </div>
        </section>
        <section class="user-menu">
          <ul class="user-list">
            <li class="login">로그인</li>
            <li class="join">회원가입</li>
            <div class="basket">
              <img src="../img/shopping-bag.png">
            </div>
          </ul>
        </section>
      </div>
      <div class="header-menu-wrapper">
        <ul class="menu-list">
          <li>
            <div class="menu-label"><a>전체상품</a></div>
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

const login = document.querySelector('.login');
const companyLogo = document.querySelector('.company-logo');
const join = document.querySelector('.join');

function log() {
  join.addEventListener('click', () => console.log('hi'))
}

export { getHeader, log };