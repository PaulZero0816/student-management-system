import { compose } from "recompose";
import { connect } from "react-redux";
import AppView from "./App";
import { ReduxStates } from "./store/types";
export default compose(
  connect((state: ReduxStates) => ({
    isAuthenticated: state.login.isAuthenticated,
  }))
)(AppView);
