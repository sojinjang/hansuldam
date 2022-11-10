const setCookie = (key, value) => {
  document.cookie =
    key + '=' + JSON.stringify(value) + '; max-age=3600; path=/;';
};

const getCookieValue = (key) => {
  let matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  return matches ? JSON.parse(decodeURIComponent(matches[1]))[key] : undefined;
};

const deleteCookie = (key) => {
  document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export { setCookie, getCookieValue, deleteCookie };
