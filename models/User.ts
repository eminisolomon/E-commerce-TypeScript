import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '@interfaces/User';

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&usqp=CAU',
      },
    },
    balance: {
      type: Number,
      default: 0,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUserModel>('User', UserSchema);
