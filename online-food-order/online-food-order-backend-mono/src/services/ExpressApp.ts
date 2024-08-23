import express , { Application } from 'express';
import path from 'path';

import { AdminRoute, VendorRoute } from '../routes'
import { ShoppingRoute } from '../routes/ShoppingRoutes';


export default async(app: Application) => {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true}))

    app.use(express.json());

    app.use('/images', express.static(path.join(__dirname,'images')))

    app.use('/admin', AdminRoute);
    app.use('/vendor', VendorRoute)
    app.use(ShoppingRoute);

    return app;
}