import { DataAccessBuilderProps } from "./index";
import { OrganizationModel } from "../db/organization_model";
import { Organization } from "../types";

const dataAccessBuilder = (props: DataAccessBuilderProps) => {
  const { db, Op, buildQuery, trx } = props;
  return {
    build: async (orgSpec: Partial<Organization>) => {
      return db.organizations.build(orgSpec, buildQuery());
    },

    findById: async (orgId: number): Promise<OrganizationModel> => {
      return db.organizations.findOne(
        buildQuery({
          where: { id: orgId },
          raw: true,
        })
      );
    },
  };
};

export type OrganizationDataAccess = ReturnType<typeof dataAccessBuilder>;
export default dataAccessBuilder;
