export interface User {
    id: string;
    uuid: string;
    name: string;
    username: string;
    password: string;
    createdAt: Date;
    modifiedAt: Date;
}

export type SignInPayload = Pick<User, 'username' | 'password'> & {
    remember?: Boolean;
};
