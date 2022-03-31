const jwt = require("jsonwebtoken");
const replaceId = require("../utils").replaceId;
const canModifyUser = require("../utils").canModifyUser;
const canModifyProject = require("../utils").canModifyProject;
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

const verifyProject = (role) => {
  return function (req, res, next) {
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
          if (
            canModifyProject() &&
            (!allowIfSelf || userId !== paramUserId)
          )
            next({ status: 403, message: `Not enough privileges.` });
          //Error
          else {
            // delete user.password;
            // replaceId(user);
            req.user = user.toJSON();
            next();
          }
        }
      });
    }
  };
};

module.exports.verifyRoleOrSelf = verifyRoleOrSelf;
module.exports.verifyProject = verifyProject;