import db from '../loaders/database';
import { DbSchema } from '../models/dbSchema';

export const getBy = (entity: keyof DbSchema, key: string, value: any) => {
    const result = db
        .get(entity)
        // @ts-ignore
        .find({ [`${key}`]: value })
        .value();

    return result;
};
export const getAllForEntity = (entity: keyof DbSchema) =>
    db.get(entity).value();
