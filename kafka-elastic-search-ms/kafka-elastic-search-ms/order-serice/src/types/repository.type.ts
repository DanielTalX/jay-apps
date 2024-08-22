type Create = (input: any) => Promise<{}>;
type Find = (id: number) => Promise<{}>;
type Update = (id: number, input: any) => Promise<{}>;
type Delete = (id: number) => Promise<boolean>;

export type CartRepositoryType = {
    createCart: Create;
    findCart: Find;
    updateCart: Update;
    deleteCart: Delete;
};