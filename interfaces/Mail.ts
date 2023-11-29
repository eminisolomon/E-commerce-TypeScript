export interface MailInterface {
    from?: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html: string;
}

export interface EmailOptions {
    service?: string;
    host?: string;
    port?: number;
    auth: {
        user: string;
        pass: string;
    };
}
