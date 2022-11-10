async function test(access_token) {
  try {
    const res = await request.get("https://openapi.naver.com/v1/nid/me", {
      method: "GET",
      headers: {
        "Content-Type": "text/json;charset=utf-8",
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(ErrorMessage[error.errorCode]);
    }

    const result = await res.json();
    console.log(result);
    return;
  } catch (error) {
    return res.json(error.data);
  }
}
