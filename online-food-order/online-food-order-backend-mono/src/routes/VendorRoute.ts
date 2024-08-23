import express, { Request, Response, NextFunction } from "express";
import multer from 'multer';
import { AddFood, GetFoods, UpdateVendorCoverImage, UpdateVendorProfile, UpdateVendorService, VendorLogin } from '../controllers';
import { Authenticate } from '../middleware';

const router = express.Router();

const imageStorage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null, 'images')
    },
    filename: function(req,file,cb){
        cb(null, new Date().toISOString()+'_'+file.originalname);
    }
})

const images = multer({ storage: imageStorage}).array('images', 10);

router.get('/login', VendorLogin);

router.use(Authenticate)
router.get('/profile', VendorLogin);
router.patch('/profile', UpdateVendorProfile);
router.patch('/coverimage', images, UpdateVendorCoverImage);
router.patch('/service', UpdateVendorService);

router.post('/food', images, AddFood);
router.get('/food', GetFoods)

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from vendor" });
});

export { router as VendorRoute };