import mongoose, { Document, Schema } from 'mongoose';
import { IAddress } from '@interfaces/Address';

export interface IAddressModel extends IAddress, Document { }

const AddressSchema: Schema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        addressLine1: {
            type: String,
            required: true,
        },
        addressLine2: {
            type: String,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        postalCode: {
            type: Number,
        }
    },
    { timestamps: true },
);

export default mongoose.model<IAddressModel>('Address', AddressSchema);