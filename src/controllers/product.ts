import { Router, Request, Response, NextFunction, request } from "express";
import { ProductModel, UserModel } from "../models";
import dotenv from "dotenv";
import { groupBy, result } from "lodash";
dotenv.config();
export const ProductController = Router();
var ObjectId = require("mongodb").ObjectId;
ProductController.post(
  "/add",
  async (request: Request, response: Response, next: NextFunction) => {
    console.log("here we are");

    const { body } = request;
    await ProductModel.syncIndexes();
    console.log("data>>>>>", body);

    let ProductData = new ProductModel(body);
    ProductData.save(async (err, data) => {
      if (data) {
        response.status(200).send({
          data,
        });
      } else if (err) throw err;
    });
  }
);

ProductController.post(
  "/delete",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      console.log("here we are");
      const { body } = request;
      console.log(body);
      if (JSON.stringify(body) !== "{}") {
        await ProductModel.syncIndexes();
        const deleteData = await ProductModel.remove({
          title: { $regex: body.title, $options: "im" },
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

ProductController.get(
  "/details",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      console.log("here we are");
      const { body } = request;
      console.log(body);
      if (JSON.stringify(body) !== "{}") {
        await ProductModel.syncIndexes();
        const findData = await ProductModel.aggregate([
          { $match: { slug: { $regex: body.slug, $options: "im" } } },
          {
            $lookup: {
              from: "categories",
              localField: "cat_id",
              foreignField: "_id",
              as: "categories_details",
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
