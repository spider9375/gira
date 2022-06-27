import {useSelector} from "react-redux";
import {selectIsProjectOverlayVisible} from "./overlays.selectors";

export const useIsProjectOverlayVisible = () => useSelector((state) => selectIsProjectOverlayVisible(state));
