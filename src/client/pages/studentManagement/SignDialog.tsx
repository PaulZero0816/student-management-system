import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  LinearProgress,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import React, { useCallback, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useCourseApi } from "../../hooks/useCourseApi";
import { useStudentsInfoApi } from "../../hooks/useStudentApi";
import { SignType } from "../../types";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { signStudents } from "../../hooks/useSignStudentsApi";

export interface Props {
  onClose: () => void;
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const SignDialog: React.FC<Props> = ({ onClose }) => {
  const styles = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [courses, courseApiLoading] = useCourseApi({ orgId: 1 });
  const [studentInfo, studentInfoLoading] = useStudentsInfoApi({ orgId: 1 });
  const [type, setType] = useState<SignType>(SignType.SIGN);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [studentIdSet, setStudentIdSet] = useState<Record<number, boolean>>({});
  const [isSigning, setIsSigning] = useState(false);
  useEffect(() => {
    if (!courses || courses.length === 0) return;
    setCourseId(courses[0].id);
  }, [courses]);

  if (
    isSigning ||
    courseApiLoading ||
    studentInfoLoading ||
    !studentInfo ||
    !courses
  ) {
    return (
      <div className={styles.postRequestMask}>
        <LinearProgress />
      </div>
    );
  }

  const renderRow = (props: ListChildComponentProps) => {
    const { index, style } = props;
    const id = studentInfo[index].id;
    return (
      <ListItem
        button
        style={style}
        key={index}
        onClick={() => {
          const { ...newObject } = studentIdSet;
          if (!studentIdSet[id]) {
            newObject[id] = true;
          } else {
            delete newObject[id];
          }
          setStudentIdSet(newObject);
        }}
      >
        <Checkbox
          edge="start"
          checked={studentIdSet[id]}
          tabIndex={-1}
          disableRipple
        />
        <ListItemText primary={`${studentInfo[index].name}`} />
      </ListItem>
    );
  };

  if (courses.length === 0) {
    return (
      <Dialog open={true} onClose={onClose} fullWidth maxWidth={"md"}>
        <>
          <div className={styles.dialogContainer}>
            <DialogTitle>签到</DialogTitle>
            <DialogContent>请先定义课程</DialogContent>
            <DialogActions>
              <Button
                onClick={onClose}
                color="primary"
                className={styles.button}
              >
                关闭
              </Button>
            </DialogActions>
          </div>
        </>
      </Dialog>
    );
  }
  if (studentInfo.length === 0) {
    return (
      <Dialog open={true} onClose={onClose} fullWidth maxWidth={"md"}>
        <>
          <div className={styles.dialogContainer}>
            <DialogTitle>签到</DialogTitle>
            <DialogContent>请先添加学生</DialogContent>
            <DialogActions>
              <Button
                onClick={onClose}
                color="primary"
                className={styles.button}
              >
                关闭
              </Button>
            </DialogActions>
          </div>
        </>
      </Dialog>
    );
  }
  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth={"md"}>
      <>
        <div className={styles.dialogContainer}>
          <DialogTitle>签到</DialogTitle>
          <DialogContent>
            <FormControl className={styles.formControl}>
              <InputLabel id="simple-select-label-1">类型</InputLabel>
              <Select
                id="simple-select-1"
                value={type}
                onChange={(event) => {
                  setType(event.target.value as SignType);
                }}
              >
                <MenuItem key={"sign-id-1"} value={SignType.SIGN}>
                  签到
                </MenuItem>
                <MenuItem key={"sign-id-2"} value={SignType.MISS}>
                  旷课
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl className={styles.formControl}>
              <InputLabel id="simple-select-label-2">课程</InputLabel>
              <Select
                id="simple-select-2"
                value={courseId}
                onChange={(event) => {
                  setCourseId(event.target.value as number);
                }}
              >
                {courses.map((course) => {
                  return (
                    <MenuItem key={course.id} value={course.id}>
                      {course.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Divider />
            <Typography variant="subtitle2" className={styles.typography}>
              学生
            </Typography>
            <FixedSizeList
              height={400}
              width={300}
              itemSize={46}
              itemCount={studentInfo.length}
            >
              {renderRow}
            </FixedSizeList>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={Object.keys(studentIdSet).length === 0 || !courseId}
              onClick={() => {
                if (!courseId) return;
                setIsSigning(true);
                signStudents(
                  Object.keys(studentIdSet).map(Number),
                  type,
                  courseId
                )
                  .then(() =>
                    enqueueSnackbar("签到成功", {
                      variant: "success",
                    })
                  )
                  .catch(() =>
                    enqueueSnackbar("签到失败", {
                      variant: "error",
                    })
                  )
                  .finally(() => setIsSigning(false));
              }}
              color="primary"
              className={styles.button}
            >
              签到
            </Button>
            <Button onClick={onClose} color="primary" className={styles.button}>
              关闭
            </Button>
          </DialogActions>
        </div>
      </>
    </Dialog>
  );
};

export default SignDialog;
