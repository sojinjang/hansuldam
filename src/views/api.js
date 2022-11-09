import { getCookie } from "./utils/cookie.js";
import { ErrorMessage } from "./Constants/ErrorMessage.js";

const TOKEN = "token";

async function get(endpoint, params = "") {
  const apiUrl = `${endpoint}/${params}`;
  const res = await fetch(apiUrl, { method: "GET" });

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
      Authorization: `Bearer ${getCookie(TOKEN)}`,
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

async function patch(endpoint, params = "", data) {
  const apiUrl = `${endpoint}/${params}`;
  const bodyData = JSON.stringify(data);
  const res = await fetch(apiUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie(TOKEN)}`,
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
  const apiUrl = `${endpoint}/${params}`;
  const bodyData = JSON.stringify(data);

  const res = await fetch(apiUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie(TOKEN)}`,
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

export { get, post, patch, del as delete };
