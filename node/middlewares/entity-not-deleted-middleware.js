// depends on req.entity
module.exports = function (req, res, next) {
  if (req.entity.deleted) {
    res.status(410).send({message: 'Entity is deleted.'});
  } else {
    next();
  }
}