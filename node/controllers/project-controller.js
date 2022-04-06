const Project = require('../models/project');
const User = require('../models/user');
const router = require('express').Router();
const { projectValidation, validate, userValidation} = require('../validation');
const authenticated = require("../middlewares/authenticated-middleware");
const { verifyRoleOrSelf, allowedRoles} = require("../middlewares/role-middleware");
const { sendErrorResponse, role } = require("../utils");
const mongoose = require("mongoose");
const entityExists = require('../middlewares/entity-exists-middleware');

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

router.get("/:projectId/tasks", authenticated, verifyRoleOrSelf(3, false), async (req, res) => {
  const { projectId } = req.params;
    if (!projectId) return sendErrorResponse(req, res, 400, `Missing projectId`);

  const tasks = await Task.find({projectId:projectId}).lean();
  // var fullTasks = tasks.map((task)=>{
    
  //   const fullTask = {

  //   }
  // })
  if (!tasks) return sendErrorResponse(req, res, 204, `No Tasks`);
  return res.status(200).send(tasks);
});
router.get("/:projectId",authenticated, verifyRoleOrSelf(1, false), async (req, res) => {
    const { projectId } = req.params;
    if (!projectId) return sendErrorResponse(req, res, 400, `Missing projectId`);
    
    const user = req.user
    const project = await Project.findOne({ _id: projectId });
    if (!project) return sendErrorResponse(req, res, 400, `There is no project with this id`);
    
    if (user.id === project.managerId || user.role === "admin" || project.team.includes(user.id)) {
      if (project.deleted) return sendErrorResponse(req, res, 400, `Project is deleted.`);
      const manager = await User.findOne({_id: project.managerId})
      const team = await User.find({_id: {$in: project.team}})
      return res.status(200).send({project,manager,team});
    }
    return sendErrorResponse(req, res, 403, `Not enough privilegies.`);
  }
);

router.put("/:projectId",
  authenticated,
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

router.delete("/:projectId", authenticated, verifyRoleOrSelf(2, false), async (req, res) => {
    const { projectId } = req.params;
    if (!projectId) return sendErrorResponse(req, res, 400, `Missing projectId`);
    
    const user = req.user
    const project = await Project.findOne({ _id: projectId });
    if (!project) return sendErrorResponse(req, res, 400, `There is no project with this id`);
    
    if(user.id===project.managerId || user.role==='admin'){
        if (project.deleted) return sendErrorResponse(req, res, 400, `Project is deleted.`);
        project.deleted = true;
        await project.save();
        return res.status(200).send({message:`Project- ${project.name} was deleted`});
    }
    return sendErrorResponse(req, res, 403, `Not enough privilegies.`);
  }
);


router.get( "/myprojects/:userId",authenticated, verifyRoleOrSelf(3, true), async (req, res) => {
  const { userId } = req.params;
  if (!userId) return sendErrorResponse(req, res, 400, `Missing userId`);
  
  const projects = await Project.find({ 
    $or: [{ team: userId }, { managerId: userId }], deleted:false });
  if (!projects) return sendErrorResponse(req, res, 400, `There is no projects with this user`);
    return res.status(200).send(projects);
});

router.post("/join/:code",authenticated,verifyRoleOrSelf(3,true),async(req,res)=>{
  
  const { code } = req.params;
  if (!code) return sendErrorResponse(req, res, 400, `Missing code`);

  const loggedUser  = req.user;
  if (!loggedUser) return sendErrorResponse(req, res, 400, `Missing user`);

  const project = await Project.findOne({ invitationCode: code });
  if (!project) return sendErrorResponse(req, res, 400, `Invalid Code`);

  const user = await User.findOne({ _id: loggedUser.id });
  if (!user) return sendErrorResponse(req, res, 400, `There is no user with this id`);
//user.project -BAD
 if (user.projects && !user.projects.includes(project.id) && !project.team.includes(user.id)) {
   user.projects.push(project.id);
   project.team.push(user.id);
 }else return sendErrorResponse(req, res, 400, `Already assigned to the project`);
 
  try {
    await user.save();
    await project.save();
    const uri = req.baseUrl + `/${project.id}` ;
    console.log('Added to Project: ', project.name);
    return res.status(200).location(`${uri}`).send(project)
  } catch (error) {
    return sendErrorResponse(req, res, 500, error);
  }

});
  
router.post("/leave/:projectId",authenticated,verifyRoleOrSelf(3,true),async(req,res)=>{
  
  const { projectId } = req.params;
  if (!projectId) return sendErrorResponse(req, res, 400, `Missing projectId`);

  const loggedUser  = req.user;
  if (!loggedUser) return sendErrorResponse(req, res, 400, `Missing user`);

  const project = await Project.findOne({ _id: projectId });
  if (!project) return sendErrorResponse(req, res, 400, `Invalid projectId`);

  const user = await User.findOne({ _id: loggedUser.id });
  if (!user) return sendErrorResponse(req, res, 400, `There is no user with this id`);
  //user.projects = undefined
if(user.id===project.managerId){
  return sendErrorResponse(req, res, 403, `Manager can't leave the project`);
}
 if (user.projects.includes(project.id) || project.team.includes(user.id)) {

  var filteredTeam = project.team.filter(userId => 
    userId !== user.id
   );

  var filtered = user.projects.filter(prId => 
    prId !== project.id
   );
   

  project.team = filteredTeam;
  user.projects = filtered;
 } else return sendErrorResponse(req, res, 400, `Not assigned to the project`);
 

  try {
    await user.save();
    await project.save()
    console.log('Removed From project: ', project.name);
    return res.status(200).send(project)
  } catch (error) {
    return sendErrorResponse(req, res, 500, error);
  }

});


module.exports = router;