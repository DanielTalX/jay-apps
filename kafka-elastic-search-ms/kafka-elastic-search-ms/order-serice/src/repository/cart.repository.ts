import { CartRepositoryType } from "../types/repository.type";

// declare repository type
const createCart = async (input: any): Promise<any> => {
  return { message: "createCart"}
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