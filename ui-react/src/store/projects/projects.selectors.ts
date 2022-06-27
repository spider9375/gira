import {projectsContext} from "./projects.context";
import {IProject} from "../../models";

export const selectProjects = (state: any): IProject[] => state[projectsContext].projects;
export const selectLoadingProjects = (state: any): boolean => state[projectsContext].loadingProjects;

export const selectProject = (state: any): IProject => state[projectsContext].project;
export const selectLoadingProject = (state: any): boolean => state[projectsContext].loadingProject;
