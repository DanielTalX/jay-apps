export interface IMessageBroker {
    NotifyToPromotionService(product: unknown): Promise<boolean>;
}