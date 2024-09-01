import { trim } from "lodash";
import { Schema,model } from "mongoose";
const ProductSchema=new Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    slug:{
        type:String,
    },
    product_image:{
        type: String
    },
    productBulk_image:{
        type: Array
    },
    summary:{
        type:String,
        required:true,

    },
    description:{
        type:String,
        required:true,

    },
    price:{
        type:Number,
        default:0
    },
    discount_type:{
        type:String,
    },
    discount_value:{
        type:String,
    },
    tags:{
        type:[String],
    },
    user_id:{
        type:Schema.Types.ObjectId,
        ref:'users',
    },
    cat_id:{
        type:Schema.Types.ObjectId,
        ref:'categories',
    },
},{timestamps:true});
export const ProductModel=model('product',ProductSchema);