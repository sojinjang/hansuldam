const makeFilterObj = ({ key, str, min, max, sort }) => {
  const filterObj = {};
  if (str) {
    filterObj[key] = { $in: str.split(",") };
  } else {
    filterObj[key] = min ? { $gte: min } : {};
    filterObj[key] = max
      ? { ...filterObj[key], $lt: max }
      : { ...filterObj[key] };
  }

  const sortObj = {};
  sortObj[key] = sort;
  return { filterObj, sortObj };
};

export { makeFilterObj };
