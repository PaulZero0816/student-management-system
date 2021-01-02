import { makeStyles } from "@material-ui/core";
import React from "react";

import HeaderView from "./Header/HeaderView";
import SidebarView from "./SideBar/SidebarView";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    maxWidth: "100vw",
    minHeight: "100vh",
    overflowX: "hidden",
  },
  contentShift: {
    flexGrow: 1,
    padding: theme.spacing(8),
    minHeight: "100vh",
    paddingTop: theme.spacing(8) + 64,
    width: `calc(100vw - ${240 + theme.spacing(6)}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));
const AppWrapper: React.FC<{}> = ({ children }) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <HeaderView />
      <SidebarView />
      <div className={styles.contentShift}>{children}</div>
    </div>
  );
};

export default AppWrapper;
