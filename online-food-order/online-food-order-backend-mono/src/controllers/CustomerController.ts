import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import express, { Request, Response, NextFunction } from 'express';
import { CreateCustomerInput, EditCustomerProfileInput, OrderInputs, UserLoginInput } from '../dto';
import { Customer, Food } from '../models';
import { Order } from '../models/Order';
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, onRequestOTP, ValidatePassword } from '../utility';

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {

    const customerInputs = plainToClass(CreateCustomerInput, req.body);

    const validationError = await validate(customerInputs, {validationError: { target: true}})

    if(validationError.length > 0){
        return res.status(400).json(validationError);
    }

    const { email, phone, password } = customerInputs;

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const { otp, expiry } = GenerateOtp();

    const existingCustomer =  await Customer.find({ email: email});

    if(existingCustomer !== null){
        return res.status(400).json({message: 'Email already exist!'});
    }

    const result = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0,
        orders: []
    })

    if(result){
        // send OTP to customer
        await onRequestOTP(otp, phone);

        //Generate the Signature
        const signature = await GenerateSignature({
            _id: result._id,
            email: result.email,
            verified: result.verified
        })
        // Send the result
        return res.status(201).json({signature, verified: result.verified, email: result.email})
    }

    return res.status(400).json({ msg: 'Error while creating user'});


}

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {

    const customerInputs = plainToClass(UserLoginInput, req.body);

    const validationError = await validate(customerInputs, {validationError: { target: true}})

    if(validationError.length > 0){
        return res.status(400).json(validationError);
    }

    const { email, password } = customerInputs;
    const customer = await Customer.findOne({ email: email});
    if(customer){
        const validation = await ValidatePassword(password, customer.password, customer.salt);

        if(validation){

            const signature = GenerateSignature({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified
            })

            return res.status(200).json({
                signature,
                email: customer.email,
                verified: customer.verified
            })
        }
    }

    return res.json({ msg: 'Error With Signup'});
}

export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {

    const { otp } = req.body;
    const customer = req.user;

    if(customer){
        const profile = await Customer.findById(customer._id);
        if(profile){
            if(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()){
                profile.verified = true;

                const updatedCustomerResponse = await profile.save();

                const signature = GenerateSignature({
                    _id: updatedCustomerResponse._id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                })

                return res.status(200).json({
                    signature,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                })
            }

        }

    }

    return res.status(400).json({ msg: 'Unable to verify Customer'});
}

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    if(customer){

        const profile = await Customer.findById(customer._id);

        if(profile){
            const { otp, expiry } = GenerateOtp();
            profile.otp = otp;
            profile.otp_expiry = expiry;

            await profile.save();
            await onRequestOTP(otp, profile.phone);

            return res.status(200).json({ message: 'OTP sent to your registered Mobile Number!'})
        }
    }

    return res.status(400).json({ msg: 'Error with Requesting OTP'});
}

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    if(customer){
        const profile =  await Customer.findById(customer._id);

        if(profile){
            return res.status(201).json(profile);
        }

    }
    return res.status(400).json({ msg: 'Error while Fetching Profile'});
}

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    const customerInputs = plainToClass(EditCustomerProfileInput, req.body);

    const validationError = await validate(customerInputs, {validationError: { target: true}})

    if(validationError.length > 0){
        return res.status(400).json(validationError);
    }

    const { firstName, lastName, address } = customerInputs;

    if(customer){
        const profile =  await Customer.findById(customer._id);

        if(profile){
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = await profile.save()

            return res.status(201).json(result);
        }
    }
    
    return res.status(400).json({ msg: 'Error while Updating Profile'});
}

/**
 * grab current login customer
 * create an order id
 * grab order items from the request [{id:xx, unit:xx}]
 * caculate order amount
 * create order with item description
 * finally update orders to user account
 */
export const CreateOrder = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    if(customer){

        const profile = await Customer.findById(customer._id);

        if(!profile){
            return res.status(400).json({ msg: 'Error while Creating Order'});
        }

        const orderId = `${Math.floor(Math.random() * 89999)+ 1000}`;

        const cart = <[OrderInputs]>req.body;

        let cartItems = Array();

        let netAmount = 0.0;

        const foods = await Food.find().where('_id').in(cart.map(item => item._id)).exec();

        foods.map(food => {
            cart.map(({ _id, unit}) => {
                if(food._id == _id){
                    netAmount += (food.price * unit);
                    cartItems.push({ food, unit})
                }
            })
        })

        if(cartItems){

            const currentOrder = await Order.create({
                orderId: orderId,
                items: cartItems,
                totalAmount: netAmount,
                orderDate: new Date(),
                paidThrough: 'COD',
                paymentReponse: '',
                orderStatus: 'Waiting'
            })

            if(currentOrder){
                profile.orders.push(currentOrder);
            }

            await profile.save();

            return res.status(200).json(currentOrder);
        }
    }

    return res.status(400).json({ msg: 'Error while Creating Order'});
}

export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    if(customer){
        const profile = await Customer.findById(customer._id).populate("orders");
        if(profile){
            return res.status(200).json(profile.orders);
        }
    }

    return res.status(400).json({ msg: 'Orders not found'});
}


export const GetOrderById = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    if(orderId){
        const order = await Customer.findById(orderId).populate("items.food");
        if(order){
            return res.status(200).json(order);
        }
    }

    return res.status(400).json({ msg: 'Order not found'});
}