import axios from "axios";
import { APIError, NotFoundError } from "../error";
import { logger } from "../logger";
import { Product } from "../../dtos/product.dto";

const CATALOG_BASE_URL = process.env.CATALOG_BASE_URL;

export const GetProductDetails = async (productId: number) => {
  try {
    const response = await axios.get(
      `${CATALOG_BASE_URL}/products/${productId}`
    );
    return response.data as Product;
  } catch (error) {
    logger.error(error);
    throw new NotFoundError("product not found");
  }
};