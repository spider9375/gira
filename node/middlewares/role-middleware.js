const { replaceId, role } = require("../utils");
const canModifyUser = require("../utils").canModifyUser;
const User = require("../models/user");

const verifyRoleOrSelf = (role, allowIfSelf) => {
  return function (req, res, next) {
    //here there is no req and res
    const paramUserId = allowIfSelf && (req.params.userId || req.userId);
    const userId = req.userId || req.body.managerId;
    if (!userId || (allowIfSelf && !paramUserId))
      next({ status: 403, message: `No userId provided.` });
    //Error
    else {
      User.findOne({ _id: userId }, function (error, user) {
        if (error) next({ status: 500, message: `Server error.`, error });
        //Error
        else if (!user) next({ status: 404, message: `User not found.` });
        //Error
        else {
          if (canModifyUser(user.role, role) && (!allowIfSelf || userId !== paramUserId))
            next({ status: 403, message: `Not enough privilegies.` });
          //Error
          else {
            delete user.password;
            replaceId(user);
            req.user = user;
            next();
          }
        }
      });
    }
  };
};

const canAccessProject = (req, res, next) => {
  if (req.user.role === role.admin || [req.entity.managerId, ...req.entity.team].includes(req.userId)) {
    next()
  } else {
    req.status(403).send();
  }
};

// depends on req.entity
const authorized = (allowSelf = true) => {
  return async function (req, res, next) {
    if (req.user.role === role.admin
      || (req.user.role === role.manager && (req.entity.role === role.user || req.entity.role === role.developer))
      || (allowSelf && req.entity.id === req.userId)) {
      next();
    } else {
      next({status: 400, message: 'Insufficient permissions.'})
    }
  }
}

const allowedRoles = (roles) => {
  return function (req, res, next) {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).send();
    }
  }
}

module.exports.authorized = authorized;
module.exports.allowedRoles = allowedRoles;

module.exports.verifyRoleOrSelf = verifyRoleOrSelf;
module.exports.canAccessProject = canAccessProject;