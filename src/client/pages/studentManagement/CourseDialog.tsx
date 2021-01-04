import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  LinearProgress,
  IconButton,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import React, { useCallback, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useSnackbar } from "notistack";
import {
  createNewCourse,
  updateCourse,
  useCourseApi,
} from "../../hooks/useCourseApi";
import { Course } from "../../types";
import Add from "@material-ui/icons/Add";

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
  unit: {
    marginLeft: "5px",
    marginRight: "5px",
  },
  postRequestMask: {
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 100,
    background: "rgba(255,255,255,0.7)",
  },
}));

const CourseDialog: React.FC<Props> = ({ onClose }) => {
  const styles = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isModifyingCourse, setIsModifyingCourse] = useState(false);
  const [createdCourse, setCreatedCourse] = useState<string | null>(null);
  const [modifiedCourse, setModifiedCourse] = useState<Course | null>(null);
  const [courses, courseLoading] = useCourseApi({ orgId: 1 });
  const validateName = useCallback(
    (newName: string) => {
      if (newName === "") {
        return "名字不能为空";
      }
      const courseNames = courses?.map((course) => course.name);
      if (courseNames && courseNames.includes(newName)) {
        return "课程不能有重复名字";
      }
      return "";
    },
    [courses]
  );
  if (isModifyingCourse || courseLoading || !courses) {
    return (
      <div className={styles.postRequestMask}>
        <LinearProgress />
      </div>
    );
  }
  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth={"md"}>
      <>
        <div className={styles.dialogContainer}>
          <DialogTitle>添加/修改 课程</DialogTitle>
          <DialogContent>
            <>
              {courses.map((course) => {
                if (modifiedCourse && course.id === modifiedCourse.id) {
                  return (
                    <TextField
                      key={course.id}
                      variant="standard"
                      value={modifiedCourse.name}
                      onChange={(e) => {
                        setModifiedCourse({
                          ...modifiedCourse,
                          name: e.target?.value as string,
                        });
                      }}
                    />
                  );
                }
                return (
                  <Button
                    key={course.id}
                    variant="outlined"
                    className={styles.unit}
                    disabled={!!(createdCourse !== null || modifiedCourse)}
                    onClick={() => {
                      setModifiedCourse(course);
                    }}
                  >
                    {course.name}
                  </Button>
                );
              })}
              {!(createdCourse !== null || modifiedCourse) && (
                <IconButton
                  aria-label="new"
                  color="primary"
                  onClick={() => {
                    setCreatedCourse("");
                  }}
                >
                  <Add />
                </IconButton>
              )}
              {createdCourse !== null && (
                <TextField
                  key={-1}
                  variant="standard"
                  value={createdCourse}
                  onChange={(e) => {
                    setCreatedCourse(e.target?.value as string);
                  }}
                />
              )}
            </>
          </DialogContent>
          <DialogActions>
            {createdCourse !== null && (
              <Button
                onClick={() => {
                  const message = validateName(createdCourse);
                  if (message !== "") {
                    enqueueSnackbar(message, {
                      variant: "error",
                    });
                    return;
                  }
                  setIsModifyingCourse(true);
                  createNewCourse(createdCourse)
                    .then(() => {
                      setCreatedCourse(null);
                      enqueueSnackbar("新建课程成功", {
                        variant: "success",
                      });
                    })
                    .catch(() =>
                      enqueueSnackbar("新建课程失败", {
                        variant: "error",
                      })
                    )
                    .finally(() => setIsModifyingCourse(false));
                }}
                color="primary"
                className={styles.button}
              >
                新建
              </Button>
            )}
            {modifiedCourse && (
              <Button
                onClick={() => {
                  const message = validateName(modifiedCourse.name);
                  if (message !== "") {
                    enqueueSnackbar(message, {
                      variant: "error",
                    });
                    return;
                  }
                  setIsModifyingCourse(true);
                  updateCourse(modifiedCourse.id, modifiedCourse.name)
                    .then(() => {
                      setModifiedCourse(null);
                      enqueueSnackbar("修改课程成功", {
                        variant: "success",
                      });
                    })
                    .catch(() =>
                      enqueueSnackbar("修改课程失败", {
                        variant: "error",
                      })
                    )
                    .finally(() => setIsModifyingCourse(false));
                }}
                color="primary"
                className={styles.button}
              >
                修改
              </Button>
            )}
            {createdCourse !== null && (
              <Button
                onClick={() => {
                  setCreatedCourse(null);
                }}
                color="secondary"
                className={styles.button}
              >
                取消
              </Button>
            )}
            {modifiedCourse && (
              <Button
                onClick={() => {
                  setModifiedCourse(null);
                }}
                color="secondary"
                className={styles.button}
              >
                取消
              </Button>
            )}
            <Button onClick={onClose} color="primary" className={styles.button}>
              关闭
            </Button>
          </DialogActions>
        </div>
      </>
    </Dialog>
  );
};

export default CourseDialog;
