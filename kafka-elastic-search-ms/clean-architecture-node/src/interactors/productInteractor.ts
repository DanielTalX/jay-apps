import { Product } from "../entities/Product";
import { IProductInteractor } from "../interfaces/IProductInteractor";
import { IProductRepository } from "../interfaces/IProductRepository";

export class ProductInteractor implements IProductInteractor {
  private repository: IProductRepository;

  constructor(
    repository: IProductRepository,
  ) {
    this.repository = repository;
  }

  async createProduct(input: any): Promise<Product> {
    const data = await this.repository.create(input);
    return data;
  }
  async updateStock(id: number, stock: number): Promise<Product> {
    const data = await this.repository.update(id, stock);
    return data;
  }
  async getProducts(limit: number, offset: number): Promise<Product[]> {
    return this.repository.find(limit, offset);
  }
}