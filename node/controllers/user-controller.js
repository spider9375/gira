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
  const allUsers = await User.find();
  const roleFilter = req.body.role;

  const filteredUsers = allUsers.filter(user => !roleFilter || user.role === roleFilter);
  if (!allUsers) return sendErrorResponse(req, res, 204, `No users`);
  return res.status(200).send(filteredUsers);
});
router.post("/", authenticated, async (req, res) => {
  const { error } = await userValidation(req.body);
  if (error) return sendErrorResponse(req, res, 400, error.details[0].message, error);

  const user = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }],});
  if (user) return sendErrorResponse(req, res, 400, `User already exists`);

  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    projects: req.body.projects,
    tasks: req.body.tasks,
    role: req.body.role ? req.body.role : "user",
    photo: req.body.photo ?? null
  });

  try {
    const savedUser = await newUser.save();
    delete(savedUser.password)
        const uri = req.baseUrl + `/${savedUser.id}`;
        console.log('Created User: ', savedUser.id);
        return res.location(uri).status(201).json(savedUser);
  } catch (error) {
    return (req, res, 500, `Server error: ${error}`, error);
  }
});

//{userId}
router.get( "/:userId",
  authenticated,
  async (req, res) => {
    const { userId } = req.params;
    if (!userId) return sendErrorResponse(req, res, 400, `Missing userId`);

    const schema = User;

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