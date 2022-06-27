import {IUser} from "../../models";
import {usersContext} from "./users.context";

export const selectUsers = (state: any): IUser[] => state[usersContext].users;
export const selectLoadingUsers = (state: any): boolean => state[usersContext].loadingUsers;

export const selectUser = (state: any): IUser => state[usersContext].user;
export const selectLoadingUser = (state: any): boolean => state[usersContext].loadingUser;
