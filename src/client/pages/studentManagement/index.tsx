import React from "react";
import { makeStyles } from "@material-ui/core";
import MaterialTable from "material-table";
import { useStudentsInfoApi } from "../../hooks/useStudentApi";

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
  const [studentInfo] = useStudentsInfoApi({ orgId });
  console.log(studentInfo);
  return (
    <MaterialTable
      title="Simple Action Preview"
      columns={[
        { title: "Name", field: "name" },
        { title: "Surname", field: "surname" },
        { title: "Birth Year", field: "birthYear", type: "numeric" },
        {
          title: "Birth Place",
          field: "birthCity",
          lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
        },
      ]}
      data={[
        { name: "Mehmet", surname: "Baran", birthYear: 1987, birthCity: 63 },
        {
          name: "Zerya Betül",
          surname: "Baran",
          birthYear: 2017,
          birthCity: 34,
        },
      ]}
      actions={[
        {
          icon: "save",
          tooltip: "Save User",
          onClick: (event, rowData) => console.log(rowData),
        },
      ]}
    />
  );
};

export default StudentManagement;
