import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@utils/HttpError';
import { jsonAll, jsonOne } from '@utils/general';
import User, { IUserModel } from '@models/User';
import { hash, compare } from 'bcrypt';
import cloudinary from '@config/cloudinary';
import { IUser } from '@interfaces/User';
import { EmailService } from '@services/Email';
import { tokenBuilder } from '@utils/Token';

const mail = new EmailService();

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;

        const data = await User.findById(userId).populate('role');
        if (!data) {
            throw new HttpError(404, 'User not found');
        }

        return jsonOne<IUser>(res, 200, data);
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req['tokenPayload'];
        const userId = payload['id'];

        const user = await User.findById(userId);

        if (!user) {
            throw new HttpError(400, "User Not Found");
        }

        const { lastName, firstName, phone, avatar } = req.body;

        user.firstName = firstName;
        user.lastName = lastName;
        user.phone = phone;

        if (avatar) {
            const result = await cloudinary.uploader.upload(avatar, {
                folder: 'bns',
            });

            const image = {
                public_id: result.public_id,
                url: result.secure_url,
            };

            user.image = image;
        }

        const savedUser = await user.save();

        const token = await tokenBuilder(user);
        const response = {
            user: savedUser,
            accessToken: token.accessToken,
        };

        return jsonOne<any>(res, 200, response);
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req['tokenPayload'];
        const userId = payload['id'];
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            throw new HttpError(400, "oldPassword and newPassword are required");
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new HttpError(422, "User not found");
        }

        const isMatch = await compare(oldPassword, user.password);

        if (!isMatch) {
            throw new HttpError(422, "Old Password is incorrect");
        }

        const hashedPassword = await hash(newPassword, 12);
        user.password = hashedPassword;

        const savedUser = await user.save();

        const name = user.firstName + " " + user.lastName;
        await mail.sendChangePassword(user.email, name);

        return jsonOne<IUserModel>(res, 200, savedUser);
    } catch (e) {
        next(e);
    }
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find().populate('role');

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found', totalCount: 0 });
        }

        const totalCount = users.length;
        const response = {
            totalCount,
            users,
        };

        return jsonAll<any>(res, 200, response);
    } catch (error) {
        return next(error);
    }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new HttpError(404, 'User not found');
        }

        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
};

const refundUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        const { amount } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            throw new HttpError(404, 'User not found');
        }

        user.balance += amount;
        await user.save();

        return jsonOne<IUser>(res, 200, user);
    } catch (error) {
        return next(error);
    }
};

export default {
    getUser,
    updateUser,
    changePassword,
    getUsers,
    deleteUser,
    refundUser,
}