import mongoose, { Schema, model, InferSchemaType } from "mongoose";

const MessageSchema = new mongoose.Schema({
    text: { type: String },
    username: { type: String },
    imageUrl: { type: String },
    date: { type: String, default: () => new Date().toLocaleString("fr-FR") }

  });
  
  export default mongoose.model("Message", MessageSchema);