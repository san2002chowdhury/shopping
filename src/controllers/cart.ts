import { Router, Request, Response, NextFunction, request } from "express";
import { ProductModel, UserModel, CartModel } from "../models";
import dotenv from "dotenv";
import { groupBy, result } from "lodash";
dotenv.config();
export const CartController = Router();
var ObjectId = require("mongodb").ObjectId;

CartController.post(
  "/addToCart",
  async (request: Request, response: Response, next: NextFunction) => {
    console.log("here we are");
    try {
      const { body } = request;
      console.log("data>>>>>", body);
      if (JSON.stringify(body) !== "{}") {
        await CartModel.syncIndexes();
        const CartData = new CartModel(body);
        CartData.save(async (err, data) => {
          if (data) {
            response.status(200).send({
              data,
            });
          } else if (err) throw err;
        });
      }
    } catch (err) {
      response.send({
        status: 500,
        msg: "Some Error Occurs",
      });
    }
  }
);

CartController.post(
  "/delete",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      console.log("here we are");
      const { body } = request;
      console.log(body);
      if (JSON.stringify(body) !== "{}") {
        await CartModel.syncIndexes();
        const deleteData = await CartModel.deleteOne({
          _id: body._id,
        });
        response.send({
          status: 201,
          msg: "Data Delete  successfully...",
          deleteData,
        });
      } else {
        response.send({
          status: 404,
          msg: "Body Is Empty",
        });
      }
    } catch (err) {
      response.send({
        status: 500,
        msg: "Some Problem Occurs...",
      });
    }
  }
);
CartController.get(
  "/details",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      console.log("here we are");
      const { body } = request;
      console.log(body);
      if (JSON.stringify(body) !== "{}") {
        await CartModel.syncIndexes();
        console.log("Here -2");
        const findData = await CartModel.aggregate([
          { $match: { user_id: ObjectId(body.user_id) } },
          {
            $lookup: {
              from: "products",
              localField: "product_id",
              foreignField: "_id",
              as: "user_details",
            },
          },
        ]);
        // 66cdfdfb7301244c0848beca
        response.send({
          status: 201,
          msg: "Data find  successfully...",
          findData,
        });
      } else {
        response.send({
          status: 404,
          msg: "Body Is Empty",
        });
      }
    } catch (err) {
      response.send({
        status: 500,
        msg: "Some Problem Occurs...",
      });
    }
  }
);
