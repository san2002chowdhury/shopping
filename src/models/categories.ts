import { Schema, model } from "mongoose";
const CategoriesSchema = new Schema(
  {
    slug: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    parent_id: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      default: null,
    },
  },
  { timestamps: true }
);
export const CategoriesModel = model("categories", CategoriesSchema);
