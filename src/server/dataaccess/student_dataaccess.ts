import { Student } from "../types";
import { StudentModel } from "../db/student_model";
import { DataAccessBuilderProps } from "./index";
import { ClientError } from "../middlewares/clientError";

const dataAccessBuilder = (props: DataAccessBuilderProps) => {
  const { db, Op, buildQuery, trx } = props;
  return {
    build: async (studentSpec: Partial<Student>) => {
      return db.students.build(studentSpec, buildQuery());
    },

    create: async (studentSpec: Partial<Student>): Promise<StudentModel> => {
      try {
        const student = await db.students.create(studentSpec, buildQuery());
        return student;
      } catch (e) {
        console.log(e);
        throw new ClientError("Create student Failed");
      }
    },

    update: async (id: number, studentSpec: Partial<Student>): Promise<StudentModel> => {
      try {
        const student = await db.students.update(studentSpec, buildQuery({
          where: { id: id }
        }));
        return student;
      } catch (e) {
        console.log(e);
        throw new ClientError("Update student Failed");
      }
    },

    findById: async (
      studentId: number,
      orgId: number
    ): Promise<StudentModel> => {
      return db.students.findOne(
        buildQuery({
          where: { id: studentId, orgId: orgId },
          raw: true,
        })
      );
    },

    findByOrgId: async (orgId: number): Promise<StudentModel> => {
      return db.students.findAll(
        buildQuery({
          where: { orgId: orgId },
          raw: true,
        })
      );
    },

    findByIds: async (orgId: number, ids: number[]): Promise<StudentModel[]> => {
      return db.students.findAll(
        buildQuery({
          where: { orgId, id: { [Op.in]: ids } },
          raw: true,
        })
      );
    },

    bulkUpsert: (student: Partial<StudentModel>[]) => {
      try {
        return db.students.bulkCreate(
          student,
          buildQuery({
            returning: true,
            updateOnDuplicate: ['course'],
          }),
        );
      } catch (e) {
        console.log(e);
        throw new ClientError("Update student Failed");
      }
    },
  };
};

export type StudentDataAccess = ReturnType<typeof dataAccessBuilder>;
export default dataAccessBuilder;
