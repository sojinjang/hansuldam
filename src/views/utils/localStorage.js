function getSavedItems(key) {
  return JSON.parse(localStorage.getItem(key));
}

function saveItems(key, itemArr) {
  localStorage.setItem(key, JSON.stringify(itemArr));
}

export { getSavedItems, saveItems };
