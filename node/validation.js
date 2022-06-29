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
    managerId: Joi.string().min(24).max(24).allow(''),
    description: Joi.string().optional(),
    team: Joi.array().items(Joi.string().min(24).max(24).allow('')).optional(),
    photo: Joi.string().uri().optional(),
    deleted: Joi.boolean(),
    updatedAt: Joi.date(),
    createdAt: Joi.date(),
  });
  return schema.validate(data);
};

const issueValidation = (data) => {
  const schema = Joi.object({
    id: Joi.string().min(24).max(24).required(),
    project: Joi.string().min(24).max(24).required(),
    addedBy: Joi.string().min(24).max(24).required(),
    assignedTo: Joi.string().allow('').min(24).max(24).optional(),
    storyPoints: Joi.number().min(0).allow(null).optional(),
    sprint: Joi.string().min(24).max(24).allow(null, '').optional(),
    title: Joi.string().min(3).max(256).required(),
    description: Joi.string().max(4096).allow(null,'').optional(),
    status: Joi.string().valid('backlog', 'todo', 'inProgress', 'pr', 'done'),
    blockedBy: Joi.string().min(24).max(24).required().optional(),
    updatedAt: Joi.date(),
    createdAt: Joi.date(),
    deleted: Joi.boolean(),
  });
  return schema.validate(data);
};

const sprintValidation = (data) => {
  const schema = Joi.object({
    id: Joi.string().min(24).max(24).required(),
    title:  Joi.string().min(3).max(128).required(),
    isActive: Joi.boolean().required(),
    addedBy: Joi.string().min(24).max(24).required(),
    project: Joi.string().min(24).max(24).required(),
    // issues: Joi.array().items(Joi.string().length(24)).optional(),
    updatedAt: Joi.date(),
    createdAt: Joi.date(),
    deleted: Joi.boolean(),
  });
  return schema.validate(data);
};

const validate = async (req, res, validatorFn, entity) => {
  const obj = JSON.parse(JSON.stringify(entity));
  const { error } = validatorFn(obj);
  if (error) {
    console.log(error.details[0].message);
    throw { message: error.details[0].message };
  }
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.projectValidation = projectValidation;
module.exports.userValidation = userValidation;
module.exports.issueValidation = issueValidation;
module.exports.sprintValidation = sprintValidation;
module.exports.validate = validate;