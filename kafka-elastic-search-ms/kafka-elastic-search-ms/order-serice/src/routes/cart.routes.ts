import express, { NextFunction, Request, Response } from "express";
import * as service from "../services/cart.service";
import * as repository from "../repository/cart.repository";

const router = express.Router();
const repo = repository.CartRepository;


router.post("/cart",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await service.CreateCart(req.body, repo);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(404).json({ error });
    }
  }
);

router.get("/cart", async (req: Request, res: Response, next: NextFunction) => {
  // comes from our auth user parsed from JWT
  const response = await service.GetCart(req.body.customerId, repo);
  return res.status(200).json(response);
});

router.patch("/cart/:lineItemId",
  async (req: Request, res: Response, next: NextFunction) => {
    const liteItemId = req.params.lineItemId;
    const response = await service.EditCart(
      {
        id: +liteItemId,
        qty: req.body.qty,
      },
      repo
    );
    return res.status(200).json(response);
  }
);

router.delete("/cart/:lineItemId",
  async (req: Request, res: Response, next: NextFunction) => {
    const liteItemId = req.params.lineItemId;
    console.log(liteItemId);
    const response = await service.DeleteCart(+liteItemId, repo);
    return res.status(200).json(response);
  }
);

export default router;