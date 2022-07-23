import mongoose, { Document, Model, model, Schema } from 'mongoose'

export interface IClass extends Document {
    sport: string;
    seniority: string;
    termins?: Date[];
    enrolledUsers?: Schema.Types.ObjectId[];
    description: string;
    duration: string;
    ratings?: Schema.Types.ObjectId[];
    rating?: number;
    createdBy: Schema.Types.ObjectId;
}

const ClassSchema = new Schema<IClass>({
    sport: { type: String, required: true },
    seniority: { type: String, required: true },
    termins: [{ type: Date }],
    enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    description: { type: String },
    duration: { type: String },
    rating: { type: Number },
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

const Class: Model<IClass> = model("Class", ClassSchema)
export default Class