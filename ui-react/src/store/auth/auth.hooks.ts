import {useSelector} from "react-redux";
import {selectIsLoggedIn} from "./auth.selectors";

export const useIsLoggedIn = () => useSelector((state) => selectIsLoggedIn(state));