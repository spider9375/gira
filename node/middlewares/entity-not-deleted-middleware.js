// depends on req.entity
module.exports = function (req, res, next) {
  if (req.entity.deleted) {
    res.status(400).send({message: 'Entity is already deleted.'});
  } else {
    next();
  }
}