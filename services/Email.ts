import { sendEmail } from "./sendEmail";
import { HttpError } from "@utils/HttpError";
import * as Templates from "@templates";

export class EmailService {
    public async sendWelcomeEmail(email: string, name: string) {
        try {
            const emailTemplate = Templates.WelcomeTemplate(name);
            const to = email;
            const subject = "Welcome to BarkAndShaw";
            const html = emailTemplate;

            await sendEmail(to, subject, html);
        } catch (error) {
            throw new HttpError(500, "Unable to send email");
        }
    }

    public async sendForgetPassword(email: string, name: string, otp: string) {
        try {
            const emailTemplate = Templates.ForgetPasswordTemplate(name, otp);
            const to = email;
            const subject = 'Forget Password';
            const html = emailTemplate;

            await sendEmail(to, subject, html);
        } catch (error) {
            throw new HttpError(500, "Unable to send email");
        }
    }

    public async sendChangePassword(email: string, name: string) {
        try {
            const emailTemplate = Templates.ChangePassword(name);
            const to = email;
            const subject = "Password Changed";
            const html = emailTemplate;

            await sendEmail(to, subject, html);
        } catch (error) {
            throw new HttpError(500, "Unable to send email");
        }
    }
}
