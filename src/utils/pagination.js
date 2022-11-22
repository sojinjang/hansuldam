const pagination = (page, perpage) => {
  const skip = perpage * (page - 1);
  const limit = perpage;

  return { skip, limit };
};
const totalPageCacul = (perpage, total) => {
  const totalPage = Math.ceil(total / perpage);

  return totalPage;
};

export { pagination, totalPageCacul };
