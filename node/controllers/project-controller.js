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

router.get("/",
  authenticated,
  async (req, res) => {
    let projects = await Project.find();
    if (req.user.role === role.admin) {
      return projects;
    }
    if (req.user.role === role.manager || req.user.role === role.developer) {
      return res.status(200).json(projects.filter(p => req.user.projects?.includes(p. id) && !p.deleted));
    }

    return res.status(401).send();
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

    let users = await User.find({_id: {$in: userIds}});

    for (let user of users) {
      if (user.role !== role.manager && user.role !== role.developer) {
        throw("Can only assign managers and developers");
      }

      if (!user.projects?.includes(req.body.id)) {
        user.projects = [req.body.id, ...user.projects];
      }
    }

    await User.bulkSave(users);

    await project.save();

    return res.status(201).send();
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
      const existingUserIds = [...req.entity.team, req.entity.managerId].filter(x => x);
      Object.assign(req.entity, req.body);
      await validate(req, res, projectValidation, req.entity);
      await req.entity.save();

      const newIds = [...req.body.team ?? [], req.body.managerId].filter(x => x);
      const removedUserIds = existingUserIds.filter(id => !newIds.includes(id));
      const addedUserIds = newIds.filter(id => !existingUserIds.includes(id));

      const removedUsers = await User.find({_id: { $in: removedUserIds }});
      for (let removedUser of removedUsers) {
        removedUser.projects = removedUser.projects.filter(id => id !== req.entity.id);
      }

      const addedUsers = await User.find({_id: { $in: addedUserIds }});
      for (let addedUser of addedUsers) {
        addedUser.projects.push(req.entity.id);
      }

      await User.bulkSave(removedUsers.concat(addedUsers));

    } catch (error) {
      return sendErrorResponse(req, res, 400, error.message);
    }

    res.status(201).send();
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

    req.status(200).send();
  });

router.get("/:projectId/sprints",
  authenticated,
  paramsExist(['projectId']),
  entityExists(Project, 'projectId'),
  entityNotDeleted,
  canAccessProject,
  async (req, res) => {
    const sprints = await Sprint.find({project: req.params.projectId });

    res.status(200).send(sprints);
  });

router.post("/:projectId/sprints",
  authenticated,
  paramsExist(['projectId']),
  entityExists(Project, 'projectId'),
  entityNotDeleted,
  allowedRoles([role.admin, role.manager]),
  async (req, res) => {
    req.body.id = mongoose.Types.ObjectId().toHexString();
    req.body.status = 'inactive';

    try {
      await validate(req, res, sprintValidation, req.body);
    } catch (error) {
      return sendErrorResponse(req, res, 400, error.message);
    }

    const newSprint = {
      _id: req.body.id,
      start: req.body.start,
      end: req.body.end,
      title: req.body.title,
      status: 'inactive',
      addedBy: req.userId,
      project: req.params.projectId,
      deleted: false,
    }

    await Sprint.create(newSprint)

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
      await validate(req, res, sprintValidation, req.entity);
      await req.entity.save();
    } catch (error) {
      return sendErrorResponse(req, res, 400, error.message);
    }

    res.status(200).send();
  });

router.get("/:projectId/issues",
  authenticated,
  paramsExist(['projectId']),
  entityExists(Project, 'projectId'),
  entityNotDeleted,
  canAccessProject,
  async (req, res) => {
    const issues = await Issue.find({_id: { $in: req.entity.issues } });

    res.status(200).send(issues);
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
      status: status.backlog,
      addedBy: req.userId,
      sprint: req.body.sprint,
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

    const user = await User.findById(req.body.assignedTo);

    if (user) {
      user.issues.push(req.body.id);
    }

    try {
      if (user) {
        await user.save();
      }
      await issue.save();
    } catch (error) {
      return sendErrorResponse(req, res, 400, error.message);
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
    const prevAssigned = req.entity.assignedTo;
    const newAssigned = req.body.assignedTo;
    const usersUpdated = [];

    if (prevAssigned !== newAssigned) {
      const user = await User.findById(prevAssigned);

      if (user) {
        user.issues = user.issues.filter(i => i !== req.entity.id);
        usersUpdated.push(user);
        req.entity.assignedTo = '';
      }

      if (newAssigned) {
        const newUser = await User.findById(newAssigned);
        newUser.issues.push(req.entity.id);
        usersUpdated.push(newUser);
      }
    }

    Object.assign(req.entity, req.body);

    try {
      await validate(req, res, issueValidation, req.entity);
    } catch (error) {
      return sendErrorResponse(req, res, 400, error.message);
    }

    await User.bulkSave(usersUpdated);
    await req.entity.save();

    res.status(200).send();
  });

module.exports = router;