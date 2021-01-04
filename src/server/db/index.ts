import dbModule from "./db";
import studentModule from "./student_model";
import organizationModule from "./organization_model";
import courseModule from "./course_model";
import userModule from "./user_model";
import courseLogModule from "./course_log_model";

const platform = dbModule();

// Models
const Student = studentModule(platform);
const Organization = organizationModule(platform);
const Course = courseModule(platform);
const User = userModule(platform);
const CourseLog = courseLogModule(platform);

// Associations
Student.belongsTo(Organization, { foreignKey: "orgId" });
Course.belongsTo(Organization, { foreignKey: "orgId" });
User.belongsTo(Organization, { foreignKey: "orgId" });
CourseLog.belongsTo(Organization, { foreignKey: "orgId" });

const tables = {
  student: Student,
  organization: Organization,
  course: Course,
  user: User,
  courseLog: CourseLog,
};

export { Student as students };
export { Organization as organizations };
export { Course as courses };
export { User as users };
export { CourseLog as courseLogs };
export { platform as sequelize };
