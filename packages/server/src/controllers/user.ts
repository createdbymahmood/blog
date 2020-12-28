import db, { USER_TABLE } from '../loaders/database';
import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import { map, flow, curry, remove } from 'lodash/fp';
import shortid from 'shortid';
import { User } from '../models/user';
import Fuse from 'fuse.js';
import { DbSchema } from '../models/dbSchema';
import { getBy } from './global';

export const getAllUsers = () => db.get(USER_TABLE).value();

export const getAllBy = (entity: keyof DbSchema, key: string, value: any) => {
    const result = db
        .get(entity)
        // @ts-ignore
        .filter({ [`${key}`]: value })
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
