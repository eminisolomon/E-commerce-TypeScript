import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@utils/HttpError';
import { jsonAll, jsonOne } from '@utils/general';
import Address, { IAddressModel } from '@models/Address';

const addAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req['tokenPayload'];
        const userId = payload['id'];
        const { addressLine1, addressLine2, city, state, country, postalCode } = req.body;

        const userAddresses = await Address.find({ user: userId });
        if (userAddresses.length >= 2) {
            throw new HttpError(400, 'You can only have a maximum of 2 addresses');
        }

        const newAddress = new Address({
            user: userId,
            addressLine1,
            addressLine2,
            city,
            state,
            country,
            postalCode,
        });

        const savedAddress = await newAddress.save();
        return jsonOne<IAddressModel>(res, 201, savedAddress);
    } catch (error) {
        return next(error);
    }
};

const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req['tokenPayload'];
        const userId = payload['id'];
        const addressId = req.params.id;
        const { addressLine1, addressLine2, city, state, country, postalCode } = req.body;

        const address = await Address.findOne({ _id: addressId, user: userId });
        if (!address) {
            throw new HttpError(404, 'Address not found');
        }

        address.addressLine1 = addressLine1;
        address.addressLine2 = addressLine2;
        address.city = city;
        address.state = state;
        address.country = country;
        address.postalCode = postalCode;

        const updatedAddress = await address.save();
        return jsonOne<IAddressModel>(res, 200, updatedAddress);
    } catch (error) {
        return next(error);
    }
};

const getAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req['tokenPayload'];
        const userId = payload['id'];
        const userAddresses = await Address.find({ user: userId });

        if (userAddresses.length === 0) {
            return jsonOne<any>(res, 200, 'No Address Comrade');
        }

        return jsonAll<IAddressModel>(res, 200, userAddresses);
    } catch (error) {
        return next(error);
    }
};

const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req['tokenPayload'];
        const userId = payload['id'];
        const addressId = req.params.id;

        const address = await Address.findOne({ _id: addressId, user: userId });
        if (!address) {
            throw new HttpError(404, 'Address not found');
        }

        await address.remove();
        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
};

export default {
    addAddress,
    updateAddress,
    getAddresses,
    deleteAddress
};
