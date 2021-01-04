import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  LinearProgress,
  TextareaAutosize,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { Student } from "../../types";
import { createNewStudent, updateStudent } from "../../hooks/useStudentApi";

export interface Props {
  title: string;
  student?: Student;
  onClose: () => void;
  type: "new" | "edit";
}

const useStyles = makeStyles((theme) => ({
  typography: {
    fontWeight: 600,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  inputRoot: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 8,
      height: 40,
      width: "80%",
    },
  },
  inputComment: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 8,
      height: 120,
      width: "80%",
    },
  },
  input: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    fontSize: "0.8rem",
  },
  button: {
    textTransform: "none",
  },
  dialogContainer: {
    padding: theme.spacing(5),
  },
  postRequestMask: {
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 100,
    background: "rgba(255,255,255,0.7)",
  },
}));

const validateStudent = (student: {
  phone: string;
  wechat: string;
  name: string;
  comment: string;
}) => {
  if (student.name === "") return "姓名不能为空";
  return "";
};

const StudentDialog: React.FC<Props> = ({ title, onClose, student, type }) => {
  const styles = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isModifyingStudent, setIsModifyingStudent] = useState(false);
  const [studentInfo, setStudentInfo] = useState<{
    id?: number;
    phone: string;
    wechat: string;
    name: string;
    comment: string;
    course: number;
  }>(
    student
      ? student
      : {
          phone: "",
          wechat: "",
          name: "",
          comment: "",
          course: 0,
        }
  );
  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth={"md"}>
      <>
        {isModifyingStudent && (
          <div className={styles.postRequestMask}>
            <LinearProgress />
          </div>
        )}
        <div className={styles.dialogContainer}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <>
              <Typography variant="subtitle2" className={styles.typography}>
                姓名
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                autoFocus
                value={studentInfo.name}
                inputProps={{
                  className: styles.input,
                  maxLength: 50, // max length for task name
                }}
                classes={{
                  root: styles.inputRoot,
                }}
                onChange={(e) => {
                  setStudentInfo({
                    ...studentInfo,
                    name: e.target?.value as string,
                  });
                }}
                size="small"
              />
              <Typography variant="subtitle2" className={styles.typography}>
                微信
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={studentInfo.wechat}
                inputProps={{
                  className: styles.input,
                  maxLength: 50, // max length for task name
                }}
                classes={{
                  root: styles.inputRoot,
                }}
                onChange={(e) => {
                  setStudentInfo({
                    ...studentInfo,
                    wechat: e.target?.value as string,
                  });
                }}
                size="small"
              />
              <Typography variant="subtitle2" className={styles.typography}>
                电话
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={studentInfo.phone}
                inputProps={{
                  className: styles.input,
                  maxLength: 11,
                }}
                classes={{
                  root: styles.inputRoot,
                }}
                onChange={(e) => {
                  for (const char of e.target.value) {
                    if (char < "0" || char > "9") return;
                  }
                  setStudentInfo({
                    ...studentInfo,
                    phone: e.target?.value as string,
                  });
                }}
                size="small"
              />
              <Typography variant="subtitle2" className={styles.typography}>
                课时
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={studentInfo.course}
                inputProps={{
                  className: styles.input,
                  maxLength: 11,
                }}
                classes={{
                  root: styles.inputRoot,
                }}
                onChange={(e) => {
                  for (const char of e.target.value) {
                    if (char < "0" || char > "9") return;
                  }
                  setStudentInfo({
                    ...studentInfo,
                    course: Number(e.target?.value as string),
                  });
                }}
                size="small"
              />
              <Typography variant="subtitle2" className={styles.typography}>
                备注
              </Typography>
              <TextareaAutosize
                value={studentInfo.comment}
                placeholder={"最多100字"}
                onChange={(e) => {
                  if (e.target.value.length > 100) {
                    return;
                  }
                  setStudentInfo({
                    ...studentInfo,
                    comment: e.target?.value as string,
                  });
                }}
                rowsMin={3}
                rowsMax={10}
              />
            </>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary" className={styles.button}>
              取消
            </Button>
            <Button
              color="primary"
              variant="contained"
              className={styles.button}
              onClick={
                type === "new"
                  ? () => {
                      const message = validateStudent(studentInfo);
                      if (message !== "") {
                        enqueueSnackbar(message, {
                          variant: "error",
                        });
                        return;
                      }
                      setIsModifyingStudent(true);
                      createNewStudent(studentInfo)
                        .then(() =>
                          enqueueSnackbar("新建学生成功", {
                            variant: "success",
                          })
                        )
                        .catch(() =>
                          enqueueSnackbar("新建学生失败", {
                            variant: "error",
                          })
                        )
                        .finally(() => setIsModifyingStudent(false));
                    }
                  : () => {
                      const message = validateStudent(studentInfo);
                      if (message !== "" || !studentInfo.id) {
                        enqueueSnackbar(message, {
                          variant: "error",
                        });
                        return;
                      }
                      setIsModifyingStudent(true);
                      updateStudent(studentInfo.id, studentInfo)
                        .then(() =>
                          enqueueSnackbar("修改学生成功", {
                            variant: "success",
                          })
                        )
                        .catch(() =>
                          enqueueSnackbar("修改学生失败", {
                            variant: "error",
                          })
                        )
                        .finally(() => setIsModifyingStudent(false));
                    }
              }
            >
              {title}
            </Button>
          </DialogActions>
        </div>
      </>
    </Dialog>
  );
};

export default StudentDialog;
