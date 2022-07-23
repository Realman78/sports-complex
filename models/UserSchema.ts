import mongoose, { Document, Model, model, Schema } from 'mongoose'

export interface IUser extends Document {
  mail: string;
  username: string;
  password: string;
  enrolledClasses?: Schema.Types.ObjectId[];
  role: string;
  status: string;
  confirmationCode: string;
  seniority: string;
}

const UserSchema = new Schema<IUser>({
  mail: { type: String, unique: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  enrolledClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  role: { type: String, required: true, default: 'USER' },
  status: { type: String, required: true, enum: ['Pending', 'Active'], default: 'Pending' },
  confirmationCode: { type: String },
  seniority: { type: String, required: true },
})
const User: Model<IUser> = model("User", UserSchema)
export default User