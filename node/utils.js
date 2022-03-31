const jwt = require('jsonwebtoken');

module.exports.replaceId = function (entity) {
  entity.id = entity._id;
  delete entity._id;
  return entity;
}

module.exports.sendErrorResponse = function(req, res, status, message, err) {
  if (req.get('env') === 'production') {
      err = undefined;
  }
  res.status(status).json({
      code: status,
      message,
      error: err
  })
}

module.exports.canModifyUser = function (role, userRole) {
  switch (userRole) {
    case 'admin':
      return true;
    case 'manager':
      return role === 'user' || role === 'developer'
    default:
      return false;
  }
}

module.exports.getBearer = function (req) {
  const token = req.header('Authorization');
  return jwt.verify(token, process.env.JWT_SECRET);
}

// todo
module.exports.canModifyProject = function () {
 return true
}