const setCookie = (key, value) => {
  document.cookie = key + "=" + JSON.stringify(value) + "; max-age=3600";
};

const getCookie = (key) => {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" + key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

export { setCookie, getCookie };
