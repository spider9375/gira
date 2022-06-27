import {createAction} from "@reduxjs/toolkit";
import {IProject} from "../../models";

export const setProjectAction = createAction<IProject>('set-project')
export const resetProjectStoreAction = createAction('reset-project-store')