import React, { forwardRef, useState } from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";
import MaterialTable from "material-table";
import { useStudentsInfoApi } from "../../hooks/useStudentApi";
import { Student, StudentStatus } from "../../types";
import Delete from "@material-ui/icons/Delete";
import Search from "@material-ui/icons/Search";
import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import ViewColumn from "@material-ui/icons/ViewColumn";
import ActionsPanel from "./ActionsPanel";
import { useSnackbar } from "notistack";
import StudentDialog from "./StudentDialog";

export interface Props {}

const useStyles = makeStyles(() => ({
  defectPerSplitGraph: {
    gridRowStart: "row2-start",
    gridColumnStart: "col1-start",
    gridColumnEnd: "end",
  },
}));

const StudentManagement: React.FC<Props> = () => {
  const styles = useStyles();
  const orgId = 1;
  const [studentInfo, studentInfoLoading] = useStudentsInfoApi({ orgId });
  const { enqueueSnackbar } = useSnackbar();
  const [newStudentDialogOpen, setNewStudentDialogOpen] = useState(false);
  if (studentInfoLoading || !studentInfo) {
    return <CircularProgress />;
  }
  return (
    <>
      {newStudentDialogOpen && (
        <StudentDialog
          title={"新添学生"}
          onClose={() => {
            setNewStudentDialogOpen(false);
          }}
          type="new"
        />
      )}
      <ActionsPanel
        onCreateNewClick={() => {
          setNewStudentDialogOpen(true);
        }}
        onRegisterClick={() => {
          enqueueSnackbar("还未实现此功能", {
            variant: "error",
          });
        }}
      />
      <MaterialTable
        title="学生信息"
        columns={[
          { title: "编号", field: "id", width: "10%" },
          { title: "姓名", field: "name", width: "15%" },
          { title: "电话", field: "phone", type: "numeric", width: "15%" },
          { title: "微信", field: "wechat", width: "15%" },
          {
            title: "状态",
            field: "status",
            render: (rowData) => {
              if (rowData.status === StudentStatus.ACTIVE) {
                return "激活";
              }
              return "";
            },
            width: "10%",
          },
          { title: "备注", field: "comment", width: "35%" },
        ]}
        data={studentInfo}
        options={{
          actionsColumnIndex: -1,
          rowStyle: {
            backgroundColor: "#EEE",
            fontSize: "10px",
          },
          headerStyle: {
            fontSize: "12px",
          },
        }}
        icons={{
          Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
          Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
          Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
          Delete: forwardRef((props, ref) => (
            <DeleteOutline {...props} ref={ref} />
          )),
          DetailPanel: forwardRef((props, ref) => (
            <ChevronRight {...props} ref={ref} />
          )),
          Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
          Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
          Filter: forwardRef((props, ref) => (
            <FilterList {...props} ref={ref} />
          )),
          FirstPage: forwardRef((props, ref) => (
            <FirstPage {...props} ref={ref} />
          )),
          LastPage: forwardRef((props, ref) => (
            <LastPage {...props} ref={ref} />
          )),
          NextPage: forwardRef((props, ref) => (
            <ChevronRight {...props} ref={ref} />
          )),
          PreviousPage: forwardRef((props, ref) => (
            <ChevronLeft {...props} ref={ref} />
          )),
          ResetSearch: forwardRef((props, ref) => (
            <Clear {...props} ref={ref} />
          )),
          Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
          SortArrow: forwardRef((props, ref) => (
            <ArrowUpward {...props} ref={ref} />
          )),
          ThirdStateCheck: forwardRef((props, ref) => (
            <Remove {...props} ref={ref} />
          )),
          ViewColumn: forwardRef((props, ref) => (
            <ViewColumn {...props} ref={ref} />
          )),
        }}
        localization={{
          header: { actions: "操作" },
          toolbar: { searchPlaceholder: "搜索" },
          pagination: {
            labelRowsSelect: "行",
            firstTooltip: "第一页",
            previousTooltip: "上一页",
            nextTooltip: "下一页",
            lastTooltip: "尾页",
          },
        }}
        actions={[
          {
            icon: () => <Edit />,
            tooltip: "编辑学生",
            onClick: (event, rowData) => {
              enqueueSnackbar("还未实现此功能", {
                variant: "error",
              });
            },
          },
          (rowData) => ({
            icon: () => <Delete />,
            tooltip: "删除学生",
            onClick: (event, rowData) => {
              enqueueSnackbar("还未实现此功能", {
                variant: "error",
              });
            },
          }),
        ]}
      />
    </>
  );
};

export default StudentManagement;
