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
    case ROLES.admin:
      return true;
    case ROLES.manager:
      return role === ROLES.user || role === ROLES.developer
    default:
      return false;
  }
}

const ROLES = {
    user: 'user',
    developer: 'developer',
    manager: 'manager',
    admin: 'admin'
}

module.exports.role = ROLES

// todo
module.exports.canModifyProject = function () {
 return true
}