const unescape = (escaped, char) => (req, res, next) => {
  const obj = req.body;
  for (const key in obj) {
    if (typeof obj[key] === "string")
      obj[key] = obj[key].replace(new RegExp(escaped, "g"), char);
  }
  return next();
};

export default unescape;
