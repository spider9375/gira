const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");
const verifyToken = require("../middlewares/verify-token");
const sendErrorResponse = require("../utils").sendErrorResponse;
const replaceId = require("../utils").replaceId;
const User = require("../Models/User");

router.post("/register", async (req, res) => {
  const { error } = await registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if user is in the database
  const email = await User.findOne({ email: req.body.email });
  if (email) return res.status(400).send("Email already exists");

  const username = await User.findOne({ username: req.body.username });
  if (username) return res.status(400).send("Username already exists");

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    gender: req.body.gender,
    username: req.body.username,
    password: req.body.password,
    role: "basic",
    photo: req.body.gender ? "male-avatar.png" : "woman-avatar.png",
  });
  try {
    const savedUser = await user.save();
    delete savedUser.password;
    const uri = req.baseUrl + "/users/" + savedUser.id;
    console.log("Created User: ", savedUser.id);
    return res.location(uri).status(201).json(savedUser);
  } catch (error) {
    return sendErrorResponse(req, res, 500, `Server error: ${error}`, error);
  }
});

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ username: username });

  if (!user)
    return sendErrorResponse(req, res, 404, `User "${username}" not found.`);
  if (user.deleted)
    return sendErrorResponse(req, res, 400, `The User is deleted.`);

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return sendErrorResponse(req, res, 401, `Unauthorized.`);

  const token = jwt.sign(
    {
      email: user.email,
      userId: user.id,
      role: user.role,
      username: user.username,
    },
    process.env.JWT_SECRET_TOKEN,
    { expiresIn: "7d" }
  );
  delete user.password;
  res.status(200).send({ token, user });
});


module.exports = router;