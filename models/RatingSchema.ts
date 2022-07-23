import mongoose, { Document, Model, model, Schema } from 'mongoose'

export interface IRating extends Document {
  comment?: string;
  rating: number;
  class: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
}

const RatingSchema = new Schema<IRating>({
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

RatingSchema.methods.toJSON = function() {
  let obj = this.toObject()
  delete obj.user
  return obj
}

const Rating: Model<IRating> = model("Rating", RatingSchema)
export default Rating