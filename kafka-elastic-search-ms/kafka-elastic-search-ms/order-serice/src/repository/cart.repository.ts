import { DB } from "../db/db.connection";
import { carts } from "../db/schema";
import { CartRepositoryType } from "../types/repository.type";

// declare repository type
const createCart = async (input: any): Promise<any> => {
  const result = await DB.insert(carts)
    .values({ customerId: 123})
    .returning({ cartId: carts.id })

  console.log("createCart result = ", result);
  return result;
};

const findCart = async (id: number): Promise<any> => {
  return { message: "findCart"}
};

const updateCart = async (id: number, input: any): Promise<any> => {
  return { message: "updateCart"}
};

const deleteCart = async (id: number): Promise<boolean> => {
  console.log("deleteCart - ID", id);
  return true;
};

const clearCartData = async (id: number): Promise<boolean> => {
  console.log("clearCartData - ID", id);
  return true;
};

export const CartRepository: CartRepositoryType = {
  createCart,
  findCart,
  updateCart,
  deleteCart,
  // clearCartData,
};