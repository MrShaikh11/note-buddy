import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  userEmail: { type: String, required: true }, // or userId if you prefer
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);
