import React from "react";
import {
  CircularProgress,
  withStyles,
  Button,
  TextField,
  createStyles,
  StyleRules,
  Theme,
} from "@material-ui/core";
import { withRouter } from "react-router";
import { StyledRoutedFormComponentProps } from "../../types";

interface Props extends Required<StyledRoutedFormComponentProps> {
  loginValue: string;
  passwordValue: string;
}

const styles = (theme: Theme): StyleRules =>
  createStyles({
    container: {
      height: "100vh",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      top: 0,
      left: 0,
    },
  });

const Login: React.SFC<Props> = ({ classes, ...props }) => {
  const handleLoginKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <>
      <TextField
        name="login"
        type="text"
        InputProps={{
          classes: {
            underline: classes.textFieldUnderline,
            input: classes.textField,
          },
        }}
        fullWidth
        margin="normal"
        placeholder="用户名"
        label="用户名"
        value={props.loginValue}
        // onChange={(e: React.ChangeEvent): void => props.handleInput(e)}
        onKeyDown={handleLoginKeyPress}
      />
      <TextField
        name="password"
        type="password"
        InputProps={{
          classes: {
            underline: classes.textFieldUnderline,
            input: classes.textField,
          },
        }}
        fullWidth
        margin="normal"
        placeholder="密码"
        label="密码"
        value={props.passwordValue}
        // onChange={(e: React.ChangeEvent): void => props.handleInput(e)}
        onKeyDown={handleLoginKeyPress}
      />
    </>
  );
};

export default withRouter(withStyles(styles, { withTheme: true })(Login));
