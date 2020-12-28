import path from 'path';
import fs from 'fs';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { User } from '../models/user';

import { DbSchema } from '../models/dbSchema';

export type TDatabase = {
    users: User[];
};

export const USER_TABLE = 'users';
export const POSTS_TABLE = 'posts';

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

seedDatabase();
export default db;
