import db, { POSTS_TABLE } from '../loaders/database';
import { getBy } from './global';

export const getAllPosts = () => db.get(POSTS_TABLE).value();
export const getPostBy = (key: string, value: any) =>
    getBy(POSTS_TABLE, key, value);
export const getPostById = (id: string) => getPostBy('id', id);
