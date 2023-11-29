import { IRole } from "./Role";

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    image: {
        public_id: string;
        url: string;
    };
    balance: number;
    role: IRole;
    password: string;
}