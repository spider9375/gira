import React from 'react';
import Navigation from "./components/navigation/Navigation";
import {Route, Routes} from "react-router-dom";
import Login from "./components/auth/login/Login";
import {useIsLoggedIn} from "./store/auth/auth.hooks";
import MyProjects from "./components/my-project/my-projects/MyProjects";
import Project from "./components/my-project/project/Project";
import Projects from './components/projects/Projects';
import CreateEditProject from "./components/projects/create-edit-project/CreateEditProject";
import Backlog from "./components/my-project/backlog/Backlog";
import ProjectOverlay from "./components/my-project/project-overlay/ProjectOverlay";
import Register from "./components/auth/register/Register";
import Users from "./components/users/users-table/Users";
import EditUser from "./components/users/edit-user/EditUser";
import ActiveSprint from "./components/my-project/active-sprint/ActiveSprint";
import Sprints from "./components/my-project/sprints/Sprints";

function App() {
    const isLoggedIn = useIsLoggedIn();

    return (
        <div className="App">
            <Navigation/>
            <ProjectOverlay/>
            <div className="main">
                {/* Define all the routes */}
                <Routes>
                    {/*<Route path="/" element={<Home />}></Route>*/}
                    {!isLoggedIn && <Route path="login" element={<Login/>}></Route>}
                    {!isLoggedIn && <Route path="register" element={<Register/>}></Route>}
                    <Route path="my-projects" element={<MyProjects/>}></Route>
                    <Route path="my-projects/:id" element={<Project/>}></Route>
                    <Route path='my-projects/:id/backlog' element={<Backlog/>}></Route>
                    <Route path='my-projects/:id/active-sprint' element={<ActiveSprint/>}></Route>
                    <Route path='my-projects/:id/sprints' element={<Sprints/>}></Route>
                    <Route path="projects" element={<Projects/>}></Route>
                    <Route path="projects/:id" element={<CreateEditProject/>}></Route>
                    <Route path="users" element={<Users/>}></Route>
                    <Route path="users/:id" element={<EditUser/>}></Route>
                    {/*<Route path="recent-recipes" element={<RecentRecipes />}></Route>*/}
                    {/*<Route path="recipe/:id" element={<Recipe />}></Route>*/}
                    {/*<Route path="users" element={<Users />}></Route>*/}
                    {/*<Route path="users/:id" element={<User />}></Route>*/}
                </Routes>
            </div>
        </div>
    );
}

export default App;
