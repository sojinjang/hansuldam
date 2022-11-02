export default function header() {
  return `<header> 
      <div class="header-container">
        <section class="navigation-menu">
          <div class="company-logo-wrapper">
            <img class="company-logo" src="../img/logo.png">
          </div>
          <div class="searchbar">
            <img class="search-img" src="../img/search-icon.png" alt="나는 돋보기">
            <span class="search-text">제품검색</span>
          </div>
        </section>
        <section class="user-menu">
          <ul class="user-list">
            <li class="login"><a href="">로그인</a></li>
            <li class="join"><a href="">회원가입</a></li>
            <div class="basket">
              <a href=""><img src="../img/shopping-bag.png"></a>
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
