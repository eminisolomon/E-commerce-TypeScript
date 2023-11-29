import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@utils/HttpError';
import { jsonOne } from '@utils/general';
import { matchedData } from 'express-validator';
import User, { IUserModel } from '@models/User';
import { RoleType, OtpType } from '@utils/enums';
import Role from '@models/Role';
import { generateOtp, verifyOtp } from '@utils/OTP';
import otpMaster from '@models/Otp';
import { compare, hash } from 'bcrypt';
import { AuthInterface } from '@interfaces/Auth';
import { tokenBuilder } from "@utils/Token";
import { EmailService } from '@services/Email';

const mail = new EmailService();

const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        const existingEmail = await User.exists({ email });
        if (existingEmail) {
            throw new HttpError(422, "Email address is already used");
        }

        const existingPhone = await User.exists({ phone });
        if (existingPhone) {
            throw new HttpError(422, "Phone number is already used");
        }

        const role = await Role.findOne({ name: RoleType.USER });
        if (!role) {
            throw new HttpError(422, "User role not found");
        }

        const hashPassword = await hash(password, 12);

        const user = new User({
            firstName,
            lastName,
            email,
            phone,
            password: hashPassword,
            role: role._id,
        });
        const savedUser = await user.save();


        const name = firstName + ' ' + lastName;
        await mail.sendWelcomeEmail(email, name);

        return jsonOne<IUserModel>(res, 201, savedUser);
    } catch (error) {
        next(error);
    }
};

const signin = async (req: Request, res: Response, next: NextFunction): Promise<AuthInterface> => {
    try {
        let bodyData = matchedData(req, {
            includeOptionals: true,
            locations: ['body'],
        });

        const { email, password } = bodyData;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new HttpError(400, "Account with email not found");
        }

        const isValidPass = await compare(password, existingUser.password);

        if (!isValidPass) {
            throw new HttpError(400, "You have entered an invalid password");
        }

        const token = await tokenBuilder(existingUser);
        const response = {
            user: existingUser,
            accessToken: token.accessToken,
        };

        return jsonOne<AuthInterface>(res, 200, response);
    } catch (error) {
        next(error);
    }
};

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email }).populate('role');

        if (!user) {
            throw new HttpError(400, 'Email Address Does Not Exist');
        }

        let tokenExpiration: any = new Date();
        tokenExpiration = tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 10);

        const otp: string = generateOtp(6);

        let newOtp = new otpMaster({
            userId: user._id,
            type: OtpType.FORGET,
            otp,
            otpExpiration: new Date(tokenExpiration),
        });
        await newOtp.save();

        const name = user.firstName + ' ' + user.lastName;
        await mail.sendForgetPassword(email, name, otp);

        return jsonOne<string>(res, 200, 'Forget Password OTP Sent');
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp, password } = req.body;
  
      let user = await User.findOne({ email });
      if (!user) {
        throw new HttpError(400, "You have entered an invalid email address");
      }
      let isOtpValid = await verifyOtp(user._id, otp, OtpType.FORGET);
      if (!isOtpValid) {
        throw new HttpError(400, "This OTP has Invalid");
      }
      const hashPassword = await hash(password, 12);
      user.password = hashPassword;
  
      await user.save();
  
      await otpMaster.findByIdAndDelete(isOtpValid);

      const name = user.firstName + ' ' + user.lastName;
      await mail.sendChangePassword(user.email, name);
  
      return jsonOne<string>(res, 200, 'Password updated successfully');
    } catch (e) {
      next(e);
    }
  };

export default {
    signup,
    signin,
    forgotPassword,
    resetPassword,
}