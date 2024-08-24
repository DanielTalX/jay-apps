import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { DeliveryUser, Vendor, Transaction } from '../models';
import { GeneratePassword, GenerateSalt } from "../utility";

export const FindVendorByEmail = async (email: string) => {
  return await Vendor.findOne({email})
}
export const FindVendorByID = async (id: string) => {
  return await Vendor.findById(id);
}

export const Createvendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name, address, pincode, foodType,
    email, password, ownerName, phone,
  } = <CreateVendorInput>req.body;

  const existingVendor = await FindVendorByEmail(email);

  if (existingVendor !== null) {
    return res.json({ message: "A vendor is exist with this email ID" });
  }

  //generate a salt
  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  // encrypt the password using the salt
  const createdVendor = await Vendor.create({
    name: name,
    address: address,
    pincode: pincode,
    foodType: foodType,
    email: email,
    password: userPassword,
    salt: salt,
    ownerName: ownerName,
    phone: phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
    lat: 0,
    lng: 0,
  });

  return res.json(createdVendor);
};

export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendors = await Vendor.find()
  if(vendors !== null){
      return res.json(vendors)
  }
  return res.json({"message": "Vendors data not available"})
};

export const GetVendorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendorId = req.params.id;
  const vendors = await FindVendorByID(vendorId);

  if(vendors !== null){
    return res.json(vendors)
  }

  return res.json({"message": "Vendors data not available"})
};

export const GetTransactions = async (req: Request, res: Response, next: NextFunction) => {

  const transactions = await Transaction.find();

  if(transactions){
      return res.status(200).json(transactions)
  }

  return res.json({"message": "Transactions data not available"})

}


export const GetTransactionById = async (req: Request, res: Response, next: NextFunction) => {

  const id = req.params.id;

  const transaction = await Transaction.findById(id);

  if(transaction){
      return res.status(200).json(transaction)
  }

  return res.json({"message": "Transaction data not available"})
}

export const VerifyDeliveryUser = async (req: Request, res: Response, next: NextFunction) => {

  const { _id, status } = req.body;

  if(_id) {
    const profile = await DeliveryUser.findById(_id);

    if(profile){
      profile.verified = status;
      const result = await profile.save();

      return res.status(200).json(result);
    }
  }

  return res.json({ message: 'Unable to verify Delivery User'});
}


export const GetDeliveryUsers = async (req: Request, res: Response, next: NextFunction) => {

  const deliveryUsers = await DeliveryUser.find();

  if(deliveryUsers){
      return res.status(200).json(deliveryUsers);
  }

  return res.json({ message: 'Unable to get Delivery Users'});
}
