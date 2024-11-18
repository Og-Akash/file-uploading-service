import { Schema, model } from 'mongoose';
const mediaSchema = new Schema({
    name: { type: String, required: true },
    fileType: { type: String, required: true },
    videoUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
export const media = model("medias", mediaSchema);
