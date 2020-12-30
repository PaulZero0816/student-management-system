import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import {
  MuiThemeProvider,
  createMuiTheme,
  CssBaseline,
} from "@material-ui/core";
import defaultTheme from "./themes";
import { SnackbarProvider } from "notistack";
import PATH from "./constants/path";
import AppLayout from "./components/Layout";
import Login from "./pages/login/Login";
import StudentManagement from "./pages/studentManagement";

const theme = createMuiTheme(defaultTheme);

const PrivateRoute = ({
  component,
  ...rest
}: {
  component: any;
  path: string;
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem("user_login") ? (
          React.createElement(component, props)
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

const PublicRoute = ({
  component,
  ...rest
}: {
  component: any;
  path: string;
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem("user_login") ? (
          <Redirect
            to={{
              pathname: "/",
            }}
          />
        ) : (
          React.createElement(component, props)
        )
      }
    />
  );
};

class App extends React.Component {
  constructor(props: any | undefined) {
    super(props);
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          preventDuplicate
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <BrowserRouter>
            <Switch>
              <Route
                exact
                path="/"
                render={() => <Redirect to={PATH.studentInfo} />}
              />
              {/* <PrivateRoute path="/app" component={AppLayout} />
              <PublicRoute path="/login" component={Login} /> */}
              <Route path={PATH.studentInfo} component={StudentManagement} />
            </Switch>
          </BrowserRouter>
        </SnackbarProvider>
      </MuiThemeProvider>
    );
  }
}
export default App;
