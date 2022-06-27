import {overlaysContext} from "./overlays.context";

export const selectIsProjectOverlayVisible = (state: any): boolean => state[overlaysContext].isProjectOverlayVisible;
