import dbModule from "./db";
import studentModule from "./student_model";
import organizationModule from "./organization_model";

const platform = dbModule();

// Models
const Student = studentModule(platform);
const Organization = organizationModule(platform);

// Associations
Student.belongsTo(Organization, { foreignKey: "orgId" });

const tables = {
  student: Student,
  organization: Organization,
};

export { Student as students };
export { Organization as organizations };
export { platform as sequelize };
