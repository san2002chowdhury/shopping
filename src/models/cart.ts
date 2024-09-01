import { Schema, model } from "mongoose";
import { ProductModel, UserModel } from "./index";
const CartSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "products",
    },
    status: {
      type: String,
    },
    // price:{
    //     type:Schema.Types.Number,
    //     ref:'products',
    // },
    quantity: {
      type: Number,
    },
  },
  { timestamps: true }
);
export const CartModel = model("cart", CartSchema);
