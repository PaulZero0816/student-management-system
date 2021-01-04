import { User } from "../types";
import { UserModel } from "../db/user_model";
import { DataAccessBuilderProps } from "./index";
import { ClientError } from "../middlewares/clientError";

const dataAccessBuilder = (props: DataAccessBuilderProps) => {
    const { db, Op, buildQuery, trx } = props;
    return {
        create: async (userSpec: Partial<User>): Promise<UserModel> => {
            try {
                const user = await db.users.create(userSpec, buildQuery());
                return user;
            } catch (e) {
                console.log(e);
                throw new ClientError("Create user Failed");
            }
        },

        findById: async (
            userId: number,
            orgId: number
        ): Promise<UserModel> => {
            return db.users.findOne(
                buildQuery({
                    where: { id: userId, orgId: orgId },
                    raw: true,
                })
            );
        },

        findByName: async (
            name: string,
            orgId: number
        ): Promise<UserModel> => {
            return db.users.findOne(
                buildQuery({
                    where: { name, orgId: orgId },
                    raw: true,
                })
            );
        },

        findByOrgId: async (orgId: number): Promise<UserModel> => {
            return db.users.findAll(
                buildQuery({
                    where: { orgId: orgId },
                    raw: true,
                })
            );
        },
    };
};

export type UserDataAccess = ReturnType<typeof dataAccessBuilder>;
export default dataAccessBuilder;
