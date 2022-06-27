import {createReducer} from '@reduxjs/toolkit'
import {IProject} from "../../models";
import {getAllProjectsAsyncAction, getProjectAsyncAction} from "./projects.action-creators";
import {resetProjectStoreAction, setProjectAction} from "./projects.actions";

export interface ProjectsState {
    projects: IProject[],
    project: IProject | null,
    loadingProjects: boolean;
    loadingProject: boolean;
}

const initialState: ProjectsState = {
    loadingProjects: false,
    loadingProject: false,
    projects: [],
    project: null
}

export const projectsReducer = createReducer(initialState, builder => builder
    .addCase(getAllProjectsAsyncAction.pending, (state, action) => {
        state.loadingProjects = true;
    })
    .addCase(getAllProjectsAsyncAction.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.loadingProjects = false;
        state.project = null;
    })
    .addCase(getProjectAsyncAction.pending, (state, action) => {
        state.loadingProject = true;
    })
    .addCase(getProjectAsyncAction.fulfilled, (state, action) => {
        state.project = action.payload;
        state.loadingProject = false;
    })
    .addCase(setProjectAction, (state, action) => {
        state.project = action.payload;
    })
    .addCase(resetProjectStoreAction, (state, action) => {
        return initialState;
    })
    .addDefaultCase((state, action) => {
        return state;
    })
);

export default projectsReducer;