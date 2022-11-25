const makeFilterObj = ({ key, str, min, max, sort }) => {
  const filterObj = {};
  if (str) {
    filterObj[key] = { $in: str.split(",") };
  } else {
    filterObj[key] = min ? { $gte: min } : {};
    filterObj[key] = max ? { ...filterObj[key], $lt: max } : { ...filterObj[key] };
  }

  const sortObj = {};
  sortObj[key] = sort;
  return { filterObj, sortObj };
};

const makeKeywordObj = ({ key, str, sort, sortKey }) => {
  str = str.split(" ").join(`|`);
  const fieldObj = { $regex: str, $options: "i" };
  const fieldArr = key.split(",").map((cur) => {
    const t = {};
    t[cur] = fieldObj;
    return t;
  });
  const filterObj = { $or: fieldArr };

  const sortObj = {};
  sortObj[sortKey] = sort;

  return { filterObj, sortObj };
};

export { makeFilterObj, makeKeywordObj };
