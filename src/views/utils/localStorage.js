function getSavedItems(key) {
  return JSON.parse(localStorage.getItem(key));
}

function saveItems(key, itemArr) {
  localStorage.setItem(key, JSON.stringify(itemArr));
}

function resetCart(key) {
  localStorage.setItem(key, JSON.stringify([]));
}

export { getSavedItems, saveItems, resetCart };
