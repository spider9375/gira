import {createReducer} from "@reduxjs/toolkit";
import {closeOverlay, openOverlay} from "./overlays.actions";

interface IOverlaysState {
    isProjectOverlayVisible: boolean
}

const initialState: IOverlaysState = {
    isProjectOverlayVisible: false,
}

export const overlaysReducer = createReducer(initialState, builder => builder
    .addCase(openOverlay, (state, action) => {
        state.isProjectOverlayVisible = true;
    })
    .addCase(closeOverlay, (state, action) => {
        state.isProjectOverlayVisible = false;
    })
    .addDefaultCase((state, action) => {
        return state;
    })
);

export default overlaysReducer;
