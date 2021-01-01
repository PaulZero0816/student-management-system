import { Transaction } from "sequelize";
import { ClientError } from "../middlewares/clientError";
import { BuildQuery } from ".";

// @ts-ignore
const isOneOfClasses = (instance, classes) => {
  for (const clazz of classes) {
    if (instance instanceof clazz) {
      return true;
    }
  }
  return false;
};

async function upsertInternal(
  spec: Record<string, any>,
  condition: Record<string, any>,
  model: string,
  db: any,
  buildQuery: BuildQuery,
  transaction: Transaction
) {
  const [record, created] = await db[model].findOrCreate(
    buildQuery({
      where: condition,
      defaults: spec,
      transaction: transaction,
    })
  );
  let result = record;
  if (!created) {
    result = await record.update(
      spec,
      buildQuery({
        transaction: transaction,
        returning: true,
      })
    );
  }
  return [result, created];
}

// @ts-ignore
export default <T extends Model>(db, model, Op, buildQuery, trx?) => {
  return {
    // @ts-ignore
    build: (spec) => db[model].build(spec, buildQuery()),
    // @ts-ignore
    create: (spec): T =>
      db[model].create(spec, buildQuery({ transaction: trx })),
    // @ts-ignore
    update: (spec) => db[model].update(spec, buildQuery({ transaction: trx })),

    // @ts-ignore
    createWithCatch: async (spec) => {
      try {
        return await db[model].create(spec, buildQuery());
      } catch (e) {
        console.log(e.message);
      }
    },
    /**
     * Returns [created/updated: record, isCreated: boolean]
     */
    upsert: async (
      spec: Record<string, any>,
      condition: Record<string, any>
    ) => {
      if (trx) {
        return upsertInternal(spec, condition, model, db, buildQuery, trx);
      } else {
        return db.sequelize.transaction(async (t: Transaction) => {
          return upsertInternal(spec, condition, model, db, buildQuery, t);
        });
      }
    },

    // @ts-ignore
    findById: (orgId, id) => {
      return db[model].findOne(
        buildQuery({
          where: { id: id, orgId: orgId },
        })
      );
    },

    findOneGeneric: (
      orgId: number,
      condition: Record<string, any>,
      externalTransaction?: Transaction
    ): any => {
      return db[model].findOne(
        buildQuery({
          where: {
            ...condition,
            orgId,
          },
          transaction: externalTransaction || trx,
        })
      );
    },

    // @ts-ignore
    findAllGeneric: (orgId, condition = {}) => {
      return db[model].findAll(
        buildQuery({
          where: {
            ...condition,
            orgId,
          },
        })
      );
    },
  };
};
