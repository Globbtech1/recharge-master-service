module.exports = () => {
  return function testing(req, res, next) {
    next();
  };
};
