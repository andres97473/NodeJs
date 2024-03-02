const checkOrigin = (req, res, next) => {
  console.log(req.headers);
  const token = req.headers.authorization.split(" ").pop();

  if (token === "123456") {
    next();
  } else {
    res.status(409);
    res.send({ error: "Invalid credentials" });
  }
};

module.exports = checkOrigin;
