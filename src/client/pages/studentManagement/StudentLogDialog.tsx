import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import React from "react";
import { makeStyles } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useCourseLogApi } from "../../hooks/useCourseLogApi";
import { useCourseApi } from "../../hooks/useCourseApi";
import { FixedSizeList, ListChildComponentProps } from "react-window";

export interface Props {
  onClose: () => void;
  id: number;
}

const useStyles = makeStyles((theme) => ({
  typography: {
    fontWeight: 600,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  dialogContainer: {
    padding: theme.spacing(5),
  },
  button: {
    textTransform: "none",
  },
  postRequestMask: {
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 100,
    background: "rgba(255,255,255,0.7)",
  },
}));

const StudentLogDialog: React.FC<Props> = ({ onClose, id }) => {
  const styles = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [logs, logsLoading] = useCourseLogApi({ id: id });
  const [courses, courseApiLoading] = useCourseApi({ orgId: 1 });

  const courseIdToCourseName = courses
    ? courses.reduce((obj: Record<number, string>, course) => {
        obj[course.id] = course.name;
        return obj;
      }, {})
    : {};

  if (logsLoading || !logs || courseApiLoading || !courses) {
    return (
      <div className={styles.postRequestMask}>
        <LinearProgress />
      </div>
    );
  }

  const renderRow = (props: ListChildComponentProps) => {
    const { index, style } = props;
    const courseId = logs[index].courseId;
    const time = logs[index].createdAt;
    return (
      <ListItem style={style} key={index}>
        <ListItemText
          primary={
            courseId
              ? `${logs[index].comment}  课程: ${courseIdToCourseName[courseId]}`
              : `${logs[index].comment}`
          }
          secondary={`${time}`}
        />
      </ListItem>
    );
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth={"md"}>
      <>
        <div className={styles.dialogContainer}>
          <DialogTitle>学生课时日志</DialogTitle>
          <DialogContent>
            <FixedSizeList
              height={400}
              width={300}
              itemSize={46}
              itemCount={logs.length}
            >
              {renderRow}
            </FixedSizeList>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary" className={styles.button}>
              关闭
            </Button>
          </DialogActions>
        </div>
      </>
    </Dialog>
  );
};

export default StudentLogDialog;
