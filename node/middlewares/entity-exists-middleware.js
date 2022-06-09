module.exports = function (schema, entityIdParam) {
  return async function (req, res, next) {
    req.entity = await schema.findById(req.params[entityIdParam]);
    if (req.entity) {
      next();
    } else {
      res.status(404).send({message: 'Entity does not exist'});
    }
  }
}