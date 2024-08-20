"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
class ProductController {
    constructor(interactor) {
        this.interactor = interactor;
    }
    onCreateProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                // validate logic
                const data = yield this.interactor.createProduct(body);
                return res.status(200).json(data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    onGetProducts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offset = parseInt(`${req.query.offset}`) || 0;
                const limit = parseInt(`${req.query.limit}`) || 10;
                const data = yield this.interactor.getProducts(limit, offset);
                return res.status(200).json(data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    onUpdateStock(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const stock = req.body.stock;
                const data = yield this.interactor.updateStock(id, stock);
                return res.status(200).json(data);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ProductController = ProductController;
