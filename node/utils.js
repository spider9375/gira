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
  });
}

module.exports.canModifyUser = function (toModify, req) {
  switch (req.user.role) {
    case ROLES.admin:
      return true;
    case ROLES.manager:
      return toModify.role === ROLES.user || toModify.role === ROLES.developer;
    default:
      return toModify.id === req.userId;
  }
}

module.exports.role = {
  user: 'user',
  developer: 'developer',
  manager: 'manager',
  admin: 'admin'
}

module.exports.status = {
  backlog: 'backlog',
  todo: 'todo',
  inProgress: 'inProgress',
  pr: 'pr',
  qa: 'qa',
  done: 'done',
  closed: 'closed'
}
