import mongoose, { Schema, model, InferSchemaType } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  picturePath: { type: String }, // lien Cloudinary
});

export type IUser = InferSchemaType<typeof UserSchema>;

export default model("User", UserSchema);
