import { injectable } from "inversify";
import { IMailer } from "../interfaces/IMailer";

@injectable()
export class Mailer implements IMailer {
  async SendEmail(to: string, product: unknown): Promise<boolean> {
    // send grid implementation
    console.log("sending email");
    return Promise.resolve(true);
  }
}