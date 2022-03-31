const Joi = require("joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    username: Joi.string()
      .regex(/^[a-z0-9_-]{3,15}$/)
      .required(),
    email: Joi.string().email().lowercase().required().min(6),
    password: Joi.string()
      .required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string()
      .required(),
  });
  return schema.validate(data);
};

const userValidation = (data) => {
  const schema = Joi.object({
    id: Joi.string().min(24).max(24),
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    username: Joi.string().min(3).required(),
    password: Joi.string().regex(/^\$2[ayb]\$.{56}$/),
    email: Joi.string().email().lowercase().required().min(6),
    role: Joi.string().valid("manager", "admin", "user", "developer"),
    tasks: Joi.array().items(Joi.string().min(24).max(24)).optional(),
    projects: Joi.array().items(Joi.string().min(24).max(24)).optional(),
    deleted: Joi.boolean(),
    photo:Joi.string().uri().optional(),
    updatedAt: Joi.date(),
    createdAt: Joi.date(),
  });
  return schema.validate(data);
};

const projectValidation = (data) => {
  const schema = Joi.object({
    id: Joi.string().min(24).max(24),
    name: Joi.string().min(3).required(),
    managerId: Joi.string().min(24).max(24),
    description: Joi.string().optional(),
    issues: Joi.array().items(Joi.string().length(24)).optional(),
    team: Joi.array().items(Joi.string().length(24)).optional(),
    company: Joi.string(),
    photo: Joi.string().uri(),
    deleted: Joi.boolean(),
    updatedAt: Joi.date(),
    createdAt: Joi.date(),
  });
  return schema.validate(data);
};

const issueValidation = (data) => {
  const schema = Joi.object({
    id: Joi.string().min(24).max(24),
    projectId: Joi.string().min(24).max(24),
    assignedBy: Joi.string().min(24).max(24),
    assignedTo: Joi.string().min(24).max(24),
    label: Joi.string().min(3).max(256).required(),
    description: Joi.string().min(3).max(4096),
    status: Joi.string().valid("todo","inprogress","review","done"),
    blockedBy: Joi.array().items(Joi.string().min(24).max(24)).optional(),
    updatedAt: Joi.date(),
    createdAt: Joi.date(),
    deleted: Joi.boolean(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.projectValidation = projectValidation;
module.exports.userValidation = userValidation;
module.exports.issueValidation = issueValidation;