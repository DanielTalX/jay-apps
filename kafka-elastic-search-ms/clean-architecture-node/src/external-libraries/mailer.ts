import { IMailer } from "../interfaces/IMailer";

export class Mailer implements IMailer {
  async SendEmail(to: string, product: unknown): Promise<boolean> {
    // send grid implementation
    console.log("sending email");
    return Promise.resolve(true);
  }
}