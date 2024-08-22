import { CartEditRequestInput } from "../dtos/cartRequest.do";
import { CartRepositoryType } from "../types/repository.type";

export const CreateCart = async (
  input: CartEditRequestInput,
  repo: CartRepositoryType
) => {
  // make a sync call to catalog ms
  return await repo.createCart(input);
};

export const GetCart = async (id: number, repo: CartRepositoryType) => {
  const data = await repo.findCart(id);
  if (!data) {
    throw new Error("cart not found");
  }

  return data;
};

export const EditCart = async (
  input: any,
  repo: CartRepositoryType
) => {
  const data = await repo.updateCart(input.id, input.qty);
  return data;
};

export const DeleteCart = async (id: number, repo: CartRepositoryType) => {
  const data = await repo.deleteCart(id);
  return data;
};