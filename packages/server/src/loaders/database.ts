import path from 'path';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import { v4 } from 'uuid';
import { map, flow, curry, remove } from 'lodash/fp';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import shortid from 'shortid';
import { User } from '../models/user';
import Fuse from 'fuse.js';

import { DbSchema } from '../models/dbSchema';

export type TDatabase = {
    users: User[];
};

const USER_TABLE = 'users';

const databaseFile = path.join(__dirname, '../localDB/database.json');
const adapter = new FileSync<DbSchema>(databaseFile);

const db = low(adapter);

export const seedDatabase = () => {
    const testSeed = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, '../localDB/databaseSeed.json'),
            'utf-8'
        )
    );

    // seed database with test data
    db.setState(testSeed).write();
    return;
};

export const getAllUsers = () => db.get(USER_TABLE).value();

export const getAllForEntity = (entity: keyof DbSchema) =>
    db.get(entity).value();

export const getAllBy = (entity: keyof DbSchema, key: string, value: any) => {
    const result = db
        .get(entity)
        // @ts-ignore
        .filter({ [`${key}`]: value })
        .value();

    return result;
};

export const getBy = (entity: keyof DbSchema, key: string, value: any) => {
    const result = db
        .get(entity)
        // @ts-ignore
        .find({ [`${key}`]: value })
        .value();

    return result;
};

export const getAllByObj = (entity: keyof DbSchema, query: object) => {
    const result = db
        .get(entity)
        // @ts-ignore
        .filter(query)
        .value();

    return result;
};

// Search
export const cleanSearchQuery = (query: string) =>
    query.replace(/[^a-zA-Z0-9]/g, '');

export const setupSearch = curry(
    (items: object[], options: {}, query: string) => {
        const fuse = new Fuse(items, options);
        return fuse.search(query);
    }
);

export const performSearch = (items: object[], options: {}, query: string) =>
    flow(
        cleanSearchQuery,
        setupSearch(items, options),
        map(result => result.item)
    )(query);

export const searchUsers = (query: string) => {
    const items = getAllUsers();
    return performSearch(
        items,
        {
            keys: ['firstName', 'lastName', 'username', 'email', 'phoneNumber'],
        },
        query
    ) as User[];
};

export const removeUserFromResults = (userId: User['id'], results: User[]) =>
    remove({ id: userId }, results);

// convenience methods

// User
export const getUserBy = (key: string, value: any) =>
    getBy(USER_TABLE, key, value);
export const getUserId = (user: User): string => user.id;
export const getUserById = (id: string) => getUserBy('id', id);
export const getUserByUsername = (username: string) =>
    getUserBy('username', username);

export const createUser = (userDetails: User): User => {
    const password = bcrypt.hashSync(userDetails.password, 10);
    const user: User = {
        id: shortid(),
        uuid: v4(),
        name: userDetails.name,
        username: userDetails.username,
        password,
        createdAt: new Date(),
        modifiedAt: new Date(),
    };

    saveUser(user);
    return user;
};

const saveUser = (user: User) => {
    db.get(USER_TABLE).push(user).write();
};

export const updateUserById = (userId: string, edits: Partial<User>) => {
    const user = getUserById(userId);

    db.get(USER_TABLE).find(user).assign(edits).write();
};

export default db;
