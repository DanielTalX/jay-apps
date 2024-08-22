import { injectable } from "inversify";
import { IMessageBroker } from "../interfaces/IMessageBroker";

@injectable()
export class MessageBroker implements IMessageBroker {
  NotifyToPromotionService(product: unknown): Promise<boolean> {
    // Kafka // RabbitMQ
    console.log("Calling message broker");
    return Promise.resolve(true);
  }
}