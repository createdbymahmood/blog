import { User } from './user';
import { Post } from './post';

export interface DbSchema {
    users: User[];
    posts: Post[];
}
