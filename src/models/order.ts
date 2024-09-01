import { QueryCursor, Schema,model } from "mongoose";
const OrderSchema=new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    product_id:{
        type:Schema.Types.ObjectId,
        ref:'products',
    },
    price:{
        type:Number,
    },
    quantity:{
        type:Number,
    }
},{timestamps:true});
export const OrderModel=model('order',OrderSchema);