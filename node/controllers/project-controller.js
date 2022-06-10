const Project = require('../models/project');
const User = require('../models/user');
const router = require('express').Router();
const { projectValidation, validate, issueValidation, sprintValidation} = require('../validation');
const authenticated = require("../middlewares/authenticated-middleware");
const { allowedRoles, canAccessProject} = require("../middlewares/role-middleware");
const { sendErrorResponse, role, status} = require("../utils");
const mongoose = require("mongoose");
const entityExists = require('../middlewares/entity-exists-middleware');
const entityNotDeleted = require('../middlewares/entity-not-deleted-middleware');
const paramsExist = require("../middlewares/params-exist-middleware");
const Issue = require("../models/issue");
const Sprint = require("../models/sprint");

// Get All Projects
router.get("",
  authenticated,
  async (req, res) => {
    const projects = await Project.find();

    if (req.user.role === role.admin) {
      res.status(200).send(projects);
    }

    if (req.user.role === role.manager || req.user.role === role.developer) {
      res.status(200).json(projects.filter(p => (p.team.includes(req.userId) || p.managerId === req.userId) && !p.deleted));
    }

    return res.status(500);
})

router.get("/:projectId",
  authenticated,
  paramsExist(['projectId']),
  entityExists(Project, 'projectId'),
  entityNotDeleted,
  canAccessProject,
  async (req, res) => {
    res.status(200).send(req.entity);
  }
);

router.post("/",
  authenticated,
  allowedRoles([role.admin, role.manager]),
  async (req, res) => {
  req.body.id = mongoose.Types.ObjectId().toHexString();

  try {
    await validate(req, res, projectValidation, req.body);
  } catch (error) {
    return sendErrorResponse(req, res, 400, error.message);
  }

  const project = await Project.create({
      _id: req.body.id,
      name: req.body.name,
      managerId: req.body.managerId,
      description: req.body.description,
      issues: req.body.issues ?? [],
      team: req.body.team ?? [],
      deleted: false,
  })

  try {
    const userIds = [...project.team, project.managerId];

    const users = await User.find({_id: {$in: userIds}}) ?? [];

    if (users.includes(user => user.role !== role.manager && user.role !== role.developer)) {
      throw("Can only assign managers and developers");
    }

    if (users.length !== userIds.length) {
      throw("Some of user ids are invalid");
    }

    await project.save();

    return res.status(201).header('Location', `api/projects/${req.body.id}`).send();
  } catch (error) {
    return sendErrorResponse(req, res, 500, `Server error: ${error}`, error);
  }
})

router.put("/:projectId",
  authenticated,
  paramsExist(['projectId']),
  entityExists(Project, 'projectId'),
  allowedRoles([role.admin, role.manager]),
  async (req, res) => {
    try {
      Object.assign(req.entity, req.body);
      const userIds = [...req.entity.team, req.entity.managerId];

      const users = await User.find({_id: {$in: userIds}}) ?? [];

      if (users.includes(user => user.role !== role.manager && user.role !== role.developer)) {
        throw("Can only assign managers and developers");
      }

      if (users.length !== userIds.length) {
        throw("Some of user ids are invalid");
      }

      await validate(req, res, projectValidation, req.entity);
      await req.entity.save();
    } catch (error) {
      return sendErrorResponse(req, res, 400, error.message);
    }

    res.status(200).send();
});

router.delete("/:projectId",
  authenticated,
  paramsExist(['projectId']),
  allowedRoles([role.admin]),
  entityExists(Project, 'projectId'),
  entityNotDeleted,
  async (req, res) => {
    req.entity.deleted = true;
    await req.entity.save();

    res.status(200).send();
  });

router.get("/:projectId/sprints",
  authenticated,
  paramsExist(['projectId']),
  entityExists(Project, 'projectId'),
  entityNotDeleted,
  canAccessProject,
  async (req, res) => {
    const sprints = await Sprint.find({project: req.params.projectId, deleted: false });

    res.status(200).send(sprints);
});

router.get("/:projectId/sprints/active",
  authenticated,
  paramsExist(['projectId']),
  entityExists(Project, 'projectId'),
  entityNotDeleted,
  canAccessProject,
  async (req, res) => {
    const sprint = await Sprint.findOne({project: req.params.projectId, isActive: true, deleted: false });

    res.status(200).json(sprint);
  });

router.post("/:projectId/sprints",
  authenticated,
  paramsExist(['projectId']),
  entityExists(Project, 'projectId'),
  entityNotDeleted,
  allowedRoles([role.admin, role.manager]),
  async (req, res) => {
    const newSprint = {
      id: mongoose.Types.ObjectId().toHexString(),
      title: req.body.title,
      isActive: req.body.isActive,
      addedBy: req.userId,
      project: req.params.projectId,
      deleted: false,
    }

    try {
      await validate(req, res, sprintValidation, newSprint);
    } catch (error) {
      return sendErrorResponse(req, res, 400, error.message);
    }

    const entity = Object.assign({}, {_id: newSprint.id, ...newSprint});

    await Sprint.create(entity)

    res.status(201).send();
  });

router.put('/:projectId/sprints/:sprintId',
  authenticated,
  paramsExist(['projectId']),
  entityExists(Project, 'projectId'),
  entityExists(Sprint, 'sprintId'),
  entityNotDeleted,
  allowedRoles([role.admin, role.manager]),
  async (req, res) => {
    Object.assign(req.entity, req.body);

    try {
      await validate(req, res, sprintValidation, req.entity);
      await req.entity.save();
    } catch (error) {
      return sendErrorResponse(req, res, 400, error.message);
    }

    res.status(200).send();
  });

router.delete('/:projectId/sprints/:sprintId',
  authenticated,
  paramsExist(['projectId']),
  entityExists(Project, 'projectId'),
  entityExists(Sprint, 'sprintId'),
  entityNotDeleted,
  allowedRoles([role.admin, role.manager]),
  async (req, res) => {
    req.entity.deleted = true;

    try {
      await req.entity.save();
    } catch (error) {
      return sendErrorResponse(req, res, 400, error.message);
    }

    res.status(200).send();
  });

// getAllIssues
router.get("/:projectId/issues",
  authenticated,
  paramsExist(['projectId']),
  entityExists(Project, 'projectId'),
  entityNotDeleted,
  canAccessProject,
  async (req, res) => {
    const issues = (await Issue.find({project: req.params.projectId, deleted: false }) ?? [])
      .map(i => i.toJSON());

    res.status(200).send(issues);
});

// getSprintIssues
router.post("/:projectId/issues/filtered",
  authenticated,
  paramsExist(['projectId']),
  entityExists(Project, 'projectId'),
  entityNotDeleted,
  canAccessProject,
  async (req, res) => {
    let query =  {
      project: req.params.projectId,
      deleted: false
    }

    if (req.body.sprint) {
      query.sprint = req.body.sprint;
    }

    const issues = await Issue.find(query);

    res.status(200).json(issues);
  });

router.post("/:projectId/issues",
  authenticated,
  paramsExist(['projectId']),
  entityExists(Project, 'projectId'),
  entityNotDeleted,
  allowedRoles([role.admin, role.manager]),
  async (req, res) => {
    req.body.id = mongoose.Types.ObjectId().toHexString();

    const issue = await Issue.create({
      _id: req.body.id,
      title: req.body.title,
      status: req.body.sprint ? status.todo : status.backlog,
      addedBy: req.userId,
      sprint: req.body.sprint ?? null,
      assignedTo: req.body.assignedTo,
      project: req.params.projectId,
      storyPoints: req.body.storyPoints,
      description: req.body.description,
      blockedBy: req.body.blockedBy,
      deleted: false,
    })

    try {
      await validate(req, res, issueValidation, issue);
    } catch (error) {
      return sendErrorResponse(req, res, 400, error.message);
    }

    try {
      if (req.body.assignedTo) {
      const user = await User.findById(req.body.assignedTo);

      if (!user) {
        throw('Invalid assigned user')
      }
    }

      await issue.save();
    } catch (error) {
      sendErrorResponse(req, res, 400, error.message);
    }

    res.status(201).send();
});

router.put("/:projectId/issues/:issueId",
  authenticated,
  paramsExist(['projectId']),
  entityExists(Issue, 'issueId'),
  entityNotDeleted,
  allowedRoles([role.admin, role.manager]),
  async (req, res) => {
    try {
      if (req.body.assignedTo) {
        const user = await User.findById(req.body.assignedTo);

        if (!user){
          throw('Assigned user does not exist')
        }
      }

      Object.assign(req.entity, req.body);
      await validate(req, res, issueValidation, req.entity);
    } catch (error) {
      return sendErrorResponse(req, res, 400, error.message);
    }

    await req.entity.save();

    res.status(200).send();
  });

router.delete('/:projectId/issues/:issueId',
  authenticated,
  paramsExist(['projectId', 'issueId']),
  entityExists(Project, 'projectId'),
  entityExists(Issue, 'issueId'),
  entityNotDeleted,
  allowedRoles([role.admin, role.manager, role.developer]),
  async (req, res) => {
    req.entity.deleted = true;

    try {
      await req.entity.save();
    } catch (error) {
      return sendErrorResponse(req, res, 400, error.message);
    }

    res.status(200).send();
});

module.exports = router;