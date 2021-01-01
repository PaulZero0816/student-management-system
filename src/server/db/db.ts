import { Sequelize, DataTypes } from "sequelize";
import studentModel from "./student_model";

export default (): Sequelize => {
  const sequelize = new Sequelize(
    "student_management_system",
    "paul",
    "19950816qzq",
    {
      host: "106.55.151.203",
      dialect: "mysql",
      logging: console.log,
    }
  );

  sequelize
    .authenticate()
    .then(() => {
      console.log(`Database Connection established`);
    })
    .catch((err: Error): void => {
      console.log(`Unable to connect to database`, err);
    });
  return sequelize;
};
