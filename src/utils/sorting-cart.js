function compareId(a, b) {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}

const sortingCart = (products, productsInOrder) => {
  productsInOrder.sort(function (a, b) {
    return compareId(a.id, b.id);
  });

  let productsIn = [];
  productsInOrder.forEach((cur, idx) => {
    const product = products[idx];
    const quantity = cur.quantity;
    productsIn.push({ product, quantity });
  });

  return productsIn;
};

export { sortingCart };
