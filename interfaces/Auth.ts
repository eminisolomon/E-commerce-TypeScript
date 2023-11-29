import { IUser } from './User';

export interface AuthInterface {
    user: IUser;
    accessToken: string;
}
