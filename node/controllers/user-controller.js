const router = require("express").Router();
const { userValidation, validate } = require("../validation");
const authenticated = require("../middlewares/authenticated-middleware");
const paramsExist = require("../middlewares/params-exist-middleware");
const { authorized } = require("../middlewares/role-middleware");
const { sendErrorResponse } = require("../utils");
const User = require("../models/user");
const entityNotDeleted = require("../middlewares/entity-not-deleted-middleware");
const entityExists = require("../middlewares/entity-exists-middleware");
const Project = require("../models/project");

router.post("/",
  authenticated,
  async (req, res) => {
  const roleFilter = req.body.role;
  const users = roleFilter ? await User.find({ role: roleFilter }) : await User.find();

  if (!users) return sendErrorResponse(req, res, 204, `No users`);
  return res.status(200).send(users);
});

router.get("/project/:projectId",
  authenticated,
  paramsExist(['projectId']),
  entityExists(Project, 'projectId'),
  entityNotDeleted,
  async (req, res) => {
    const ids = [...req.entity.team, req.entity.managerId];
    const users = await User.find({ _id: {$in: ids} });

    if (!users) return sendErrorResponse(req, res, 204, `No users`);
    return res.status(200).send(users);
  });

router.get( "/:userId",
  authenticated,
  paramsExist(['userId']),
  entityExists(User, 'userId'),
  authorized(),
  entityNotDeleted,
  async (req, res) => {
    return res.status(200).send(req.entity);
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
    await validate(req, res, userValidation, req.entity);
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