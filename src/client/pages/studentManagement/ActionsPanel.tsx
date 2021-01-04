import React from "react";
import { Button, Grid, makeStyles } from "@material-ui/core";
import { useSnackbar } from "notistack";

interface Props {
  onCreateNewClick: () => void;
  onRegisterClick: () => void;
  onModifyCourseClick: () => void;
}

const useStyles = makeStyles(() => ({
  actionRoot: {
    marginTop: "15px",
    marginBottom: "15px",
  },
}));

const ActionsPanel: React.FC<Props> = ({
  onCreateNewClick,
  onRegisterClick,
  onModifyCourseClick,
}) => {
  const styles = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Grid className={styles.actionRoot} container justify="space-between">
      <Grid item container xs={6} spacing={1}>
        <Grid key={"register"} item>
          <Button variant="contained" color="primary" onClick={onRegisterClick}>
            签到
          </Button>
        </Grid>
      </Grid>
      <Grid item container justify="flex-end" xs={6} spacing={1}>
        <Grid key={"modify-course"} item>
          <Button
            variant="outlined"
            color="primary"
            onClick={onModifyCourseClick}
          >
            添加/修改课程
          </Button>
        </Grid>
        <Grid key={"add-new-student"} item>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onCreateNewClick}
          >
            添加学生
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ActionsPanel;
