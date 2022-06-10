import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./store/auth/auth.reducer";
import {authContext} from "./store/auth/auth.context";

export const store = configureStore({
    reducer: {
        [authContext]: authReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch