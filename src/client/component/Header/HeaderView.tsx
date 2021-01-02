import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  appbar: {
    background:
      "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 52%, rgba(0,212,255,1) 100%)",
    zIndex: theme.zIndex.drawer + 1,
  },
}));

const HeaderView: React.FC<{}> = () => {
  const styles = useStyles();
  return (
    <AppBar position="fixed" className={styles.appbar}>
      <Toolbar>
        <Typography variant="h6" className={styles.title}>
          学生管理系统
        </Typography>
        <Button color="inherit" onClick={() => {}}>
          注销
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderView;
