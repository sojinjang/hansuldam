const generateRandomPassword = () => {
  return Math.floor(Math.random() * 10 ** 8)
    .toString()
    .padStart("0", 8);
};

export { generateRandomPassword };
