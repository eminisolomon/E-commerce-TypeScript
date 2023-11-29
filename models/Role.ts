import mongoose, { Document, Schema } from 'mongoose';
import { IRole } from '@interfaces/Role';

export interface IRoleModel extends IRole, Document {}

const RoleSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'role is required'],
    },
  },
  { timestamps: true },
);

export default mongoose.model<IRoleModel>('Role', RoleSchema);
