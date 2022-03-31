const router = require("express").Router();
const { userValidation } = require("../validation");
const verifyToken = require("../middlewares/token-middleware");
const { verifyRoleOrSelf } = require("../middlewares/role-middleware");
const { sendErrorResponse, canModifyUser, getBearer } = require("../utils");
const User = require("../models/user");

router.get("/", verifyToken, verifyRoleOrSelf(3, false), async (req, res) => {
  const allUsers = await User.find();
  if (!allUsers) return sendErrorResponse(req, res, 204, `No users`);
  return res.status(200).send(allUsers);
});
router.post("/", verifyToken, verifyRoleOrSelf(3, false), async (req, res) => {
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
router.get( "/:userId",verifyToken, verifyRoleOrSelf(3, true), async (req, res) => {
    const { userId } = req.params;
    if (!userId) return sendErrorResponse(req, res, 400, `Missing userId`);

    const user = await User.findOne({ _id: userId });
    if (!user) return sendErrorResponse(req, res, 400, `There is no user with this id`);
    //delete(user.password)
    return res.status(200).send(user);
  }
);

router.put("/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;
  if (!userId) return sendErrorResponse(req, res, 400, `Missing userId`);

  const user = req.body;

  const bearer = getBearer(req);
  if (!canModifyUser(user.role, bearer.role)) {
    return sendErrorResponse(req, res, 400, `Your role does not allow modification of this user`);
  }

  try {
    const updated = await User.findOneAndUpdate({_id:userId},user,{
      new: true
    });
    return res.status(200).send();

  } catch (error) {
    return sendErrorResponse(req, res, 400, `Error while saving the user.`);
  }
});

router.delete( "/:userId", verifyToken, verifyRoleOrSelf(3, false), async (req, res) => {
    const { userId } = req.params;
    if (!userId) return sendErrorResponse(req, res, 400, `Missing userId`);

    const user = await User.findOne({ _id: userId });
    if (!user) return sendErrorResponse(req, res, 400, `User doesn't exist.`);

    if (user.deleted) return sendErrorResponse(req, res, 400, `User is deleted.`);
    user.deleted = true;
    await user.save();
    return res.status(200).send({message:`User ${user.username} was deleted`});
  }
);

module.exports = router;