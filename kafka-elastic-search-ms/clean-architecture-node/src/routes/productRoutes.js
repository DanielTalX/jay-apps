"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productRepository_1 = require("../repositories/productRepository");
const productInteractor_1 = require("../interactors/productInteractor");
const productController_1 = require("../controllers/productController");
const repository = new productRepository_1.ProductRepository();
const interactor = new productInteractor_1.ProductInteractor(repository);
const controller = new productController_1.ProductController(interactor);
const router = express_1.default.Router();
router.post("/products", controller.onCreateProduct.bind(controller));
router.get("/products", controller.onGetProducts.bind(controller));
router.patch("/products/:id", controller.onUpdateStock.bind(controller));
exports.default = router;
