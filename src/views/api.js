import { getCookieValue } from "./utils/cookie.js";
import { ErrorMessage } from "./constants/ErrorMessage.js";
import { Keys } from "./constants/Keys.js";

async function get(endpoint, params = "") {
  const apiUrl = params === "" ? endpoint : `${endpoint}/${params}`;
  const res = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookieValue(Keys.TOKEN_KEY)}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(ErrorMessage[error.errorCode]);
  }

  const result = await res.json();
  return result;
}

async function post(endpoint, data) {
  const apiUrl = endpoint;
  const bodyData = JSON.stringify(data);
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookieValue(Keys.TOKEN_KEY)}`,
    },
    body: bodyData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(ErrorMessage[error.errorCode]);
  }

  const result = await res.json();
  return result;
}

async function postImg(endpoint, data) {
  const apiUrl = endpoint;
  const res = await fetch(apiUrl, {
    method: "POST",
    body: data,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(ErrorMessage[error.errorCode]);
  }

  const result = await res.json();
  return result;
}

async function patch(endpoint, params = "", data) {
  const apiUrl = params === "" ? endpoint : `${endpoint}/${params}`;
  const bodyData = JSON.stringify(data);
  const res = await fetch(apiUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookieValue(Keys.TOKEN_KEY)}`,
    },
    body: bodyData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(ErrorMessage[error.errorCode]);
  }

  const result = await res.json();
  return result;
}

async function del(endpoint, params = "", data = {}) {
  const apiUrl = params === "" ? endpoint : `${endpoint}/${params}`;
  const bodyData = JSON.stringify(data);

  const res = await fetch(apiUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookieValue(Keys.TOKEN_KEY)}`,
    },
    body: bodyData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(ErrorMessage[error.errorCode]);
  }

  const result = await res.json();
  return result;
}

export { get, post, postImg, patch, del as delete };
