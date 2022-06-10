import {authContext} from "./auth.context";

export const selectIsLoggedIn = (state: any) => !!state[authContext].isLoggedIn;