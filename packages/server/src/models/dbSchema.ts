import { User } from './user';

export interface DbSchema {
    users: User[];
    posts: any;
}
