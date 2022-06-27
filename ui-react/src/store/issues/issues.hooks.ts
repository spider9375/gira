import {useSelector} from "react-redux";
import {selectIssue, selectIssues, selectLoadingIssue, selectLoadingIssues} from "./issues.selectors";

export const useIssue = () => useSelector((state) => selectIssue(state));
export const useLoadingIssue = () => useSelector((state) => selectLoadingIssue(state));

export const useIssues = () => useSelector((state) => selectIssues(state));
export const useLoadingIssues = () => useSelector((state) => selectLoadingIssues(state));
