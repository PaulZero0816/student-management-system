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

  componentDidCatch(
    error: Error,
    errorInfo: {
      componentStack: string;
    }
  ): void {
    const newErrorMessage = `Error from React ErrorBoundary: ${error.message} \n ${errorInfo.componentStack}`;
    console.log(newErrorMessage);
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
              <Route
                exact
                path={PATH.studentInfo}
                component={StudentManagement}
              />
            </Switch>
          </BrowserRouter>
        </SnackbarProvider>
      </MuiThemeProvider>
    );
  }
}
export default App;
