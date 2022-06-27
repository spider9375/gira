import {useSelector} from "react-redux";
import {selectLoadingProject, selectLoadingProjects, selectProject, selectProjects} from "./projects.selectors";

export const useProject = () => useSelector((state) => selectProject(state));
export const useLoadingProject = () => useSelector((state) => selectLoadingProject(state));

export const useProjects = () => useSelector((state) => selectProjects(state));
export const useLoadingProjects = () => useSelector((state) => selectLoadingProjects(state));
