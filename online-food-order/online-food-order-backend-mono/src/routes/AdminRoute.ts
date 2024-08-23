import express, { Request, Response, NextFunction } from "express";
import { Createvendor, GetVendorByID, GetVendors } from "../controllers";

const router = express.Router();

router.post("/vendor", Createvendor);

router.get("/vendors", GetVendors);

router.get("/vendor/:id", GetVendorByID);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from  Admin" });
});

export { router as AdminRoute };
