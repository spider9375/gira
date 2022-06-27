import {configureStore} from '@reduxjs/toolkit'
import authReducer from "./store/auth/auth.reducer";
import {authContext} from "./store/auth/auth.context";
import {projectsContext} from "./store/projects/projects.context";
import projectsReducer from "./store/projects/projects.reducer";
import {overlaysContext} from "./store/overlays/overlays.context";
import overlaysReducer from "./store/overlays/overlays.reducer";
import {issuesContext} from "./store/issues/issues.context";
import issuesReducer from "./store/issues/issues.reducer";
import {usersContext} from "./store/users/users.context";
import usersReducer from "./store/users/users.reducer";

export const store = configureStore({
    reducer: {
        [authContext]: authReducer,
        [projectsContext]: projectsReducer,
        [overlaysContext]: overlaysReducer,
        [issuesContext]: issuesReducer,
        [usersContext]: usersReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch