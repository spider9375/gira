const router = require("express").Router();
const { userValidation, validate } = require("../validation");
const authenticated = require("../middlewares/authenticated-middleware");
const paramsExist = require("../middlewares/params-exist-middleware");
const { authorized } = require("../middlewares/role-middleware");
const { sendErrorResponse } = require("../utils");
const User = require("../models/user");
const entityNotDeleted = require("../middlewares/entity-not-deleted-middleware");
const entityExists = require("../middlewares/entity-exists-middleware");

router.post("/", authenticated, async (req, res) => {
  const roleFilter = req.body.role;
  const users = roleFilter ? await User.find({ role: roleFilter }) : await User.find();

  if (!users) return sendErrorResponse(req, res, 204, `No users`);
  return res.status(200).send(users);
});

router.get( "/:userId",
  authenticated,
  async (req, res) => {
    const { userId } = req.params;
    if (!userId) return sendErrorResponse(req, res, 400, `Missing userId`);

    const user = await User.findOne({ _id: userId });
    if (!user) return sendErrorResponse(req, res, 400, `There is no user with this id`);
    //delete(user.password)
    return res.status(200).send(user);
  }
);

router.put("/:userId",
  authenticated,
  paramsExist(['userId']),
  entityExists(User, 'userId'),
  authorized(),
  entityNotDeleted,
  async (req, res) => {
  try {
    Object.assign(req.entity, req.body);
    await validate(req, res, userValidation, req.entity._doc);
    await req.entity.save();

    return res.status(200).send();
  } catch (error) {
    return sendErrorResponse(req, res, 400, error.message || `Error while saving the user.`);
  }
});

router.delete( "/:userId",
  authenticated,
  paramsExist(['userId']),
  entityExists(User, 'userId'),
  entityNotDeleted,
  authorized(false),
  async (req, res) => {
    req.entity.deleted = true;
    await req.entity.save();

    return res.status(200).send({message:`User ${req.entity.username} was deleted`});
  }
);

module.exports = router;