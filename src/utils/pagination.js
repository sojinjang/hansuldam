const pagination = (page, perPage) => {
  const skip = perPage * (page - 1);
  const limit = perPage;

  return { skip, limit };
};
const totalPageCacul = (perPage, total) => {
  const totalPage = Math.ceil(total / perPage);

  return totalPage;
};

export { pagination, totalPageCacul };
