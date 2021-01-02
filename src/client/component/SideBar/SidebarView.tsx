import {
  makeStyles,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@material-ui/core";
import React from "react";
const drawerWidth = 240;
const useStyles = makeStyles(() => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
}));

const SidebarView: React.FC<{}> = () => {
  const styles = useStyles();
  return (
    <Drawer
      className={styles.drawer}
      variant="permanent"
      classes={{
        paper: styles.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={styles.drawerContainer}>
        <List>
          {["学生信息"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
};

export default SidebarView;
