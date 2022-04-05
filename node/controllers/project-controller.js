const Project = require('../models/project');
const User = require('../models/user');
const router = require('express').Router();
const { projectValidation } = require('../validation');
const verifyToken = require("../middlewares/authenticated-middleware");
const { verifyRoleOrSelf } = require("../middlewares/role-middleware");
const { sendErrorResponse, role } = require("../utils");
const { v4: uuidv4 } = require("uuid");

router.get("/", verifyToken, async (req, res) => {
    let projects = await Project.find();
    const user = await User.findOne({_id: req.userId})
    switch (req.user.role) {
        case role.manager:
        case role.developer:
            projects = projects.filter(p=> user.projects?.includes(p.id));
            break;
        case role.user:
            return res.status(401).send();
    }
    if (!projects) return sendErrorResponse(req, res, 204, `No Projects`);
    return res.status(200).send(projects)
})
router.post("/",verifyToken, verifyRoleOrSelf(2,false), async (req, res) => {

    const { error } = await projectValidation(req.body);
    if (error) return sendErrorResponse(req, res, 400, error.details[0].message, error);

    const project = new Project({
        name: req.body.name,
        managerId: req.body.managerId,
        description: req.body.description,
        issues: req.body.issues ?? [],
        team: req.body.team,
        deleted: false,
    })
    try {
        const savedProject = await project.save();
        const uri = req.baseUrl + `/${savedProject.id}` ;
        console.log('Created Project: ', savedProject.name);
        return res.location(uri).status(201).json(savedProject);
    } catch (error) {
      return sendErrorResponse(req, res, 500, `Server error: ${error}`, error);
    }
})

router.get("/:projectId/tasks", verifyToken, verifyRoleOrSelf(3, false), async (req, res) => {
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
router.get("/:projectId",verifyToken, verifyRoleOrSelf(1, false), async (req, res) => {
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

router.put("/:projectId", verifyToken,verifyRoleOrSelf(2,false), async (req, res) => {
    const { projectId } = req.params;
    if (!projectId) return sendErrorResponse(req, res, 400, `Missing projectId`);
    
    const user = req.user
    const project = req.body
    const { error } = await projectValidation(project);
    if (error) return sendErrorResponse(req, res, 400, error.details[0].message, error);
  
  delete (project.id);
  try {
    if (user.id === project.managerId || user.role === "admin") {
      // if (project.deleted)
      //   return sendErrorResponse(req, res, 400, `Project is deleted.`);
      const updated = await Project.findOneAndUpdate(
        { _id: projectId },
        project,
        {
          new: true,
        }
      );
      return res.status(200).send();
    }
  } catch (error) {
    return sendErrorResponse(req, res, 400, `Error while saving the project.`);
  }
});

router.delete("/:projectId", verifyToken, verifyRoleOrSelf(2, false), async (req, res) => {
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


router.get( "/myprojects/:userId",verifyToken, verifyRoleOrSelf(3, true), async (req, res) => {
  const { userId } = req.params;
  if (!userId) return sendErrorResponse(req, res, 400, `Missing userId`);
  
  const projects = await Project.find({ 
    $or: [{ team: userId }, { managerId: userId }], deleted:false });
  if (!projects) return sendErrorResponse(req, res, 400, `There is no projects with this user`);
    return res.status(200).send(projects);
});

router.post("/join/:code",verifyToken,verifyRoleOrSelf(3,true),async(req,res)=>{
  
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
  
router.post("/leave/:projectId",verifyToken,verifyRoleOrSelf(3,true),async(req,res)=>{
  
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