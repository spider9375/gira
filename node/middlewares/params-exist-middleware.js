module.exports = function(params) {
  return (req, res, next) => {
    for (let param of params) {
      if (!req.params[param]) {
        next({ status: 403, message: `Missing ${param}` });
      }
    }
    next();
  }
}