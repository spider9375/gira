module.exports = function (schema, entityIdParam) {
  return async function (req, res, next) {
    req.entity = await schema.findOne({_id: req.params[entityIdParam]});
    if (req.entity) {
      next();
    } else {
      res.status(400).send({message: 'Entity does not exist'});
    }
  }
}