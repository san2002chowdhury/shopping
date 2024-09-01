import { Router, Request, Response, NextFunction, request } from "express";
import { ProductModel, CategoriesModel } from "../models";
import dotenv from "dotenv";
import { Mongoose } from "mongoose";
import { groupBy, mapKeys, result } from "lodash";
var slugify = require("slugify");

dotenv.config();
export const CategoriesController = Router();
var ObjectId = require("mongodb").ObjectId;

CategoriesController.post(
  "/add",
  async (request: Request, response: Response, next: NextFunction) => {
    console.log("here we are");

    const { body } = request;
    await CategoriesModel.syncIndexes();
    console.log("data>>>>>", body);
    let categoriesData = new CategoriesModel(body);
    categoriesData.save(async (err, data) => {
      if (data) {
        response.status(200).send({
          data,
        });
      } else if (err) throw err;
    });
  }
);
//   console.log(body.slug);

//   body.slug= await slugify(body.slug,{
//     replacement:'-',
//     remove:/' '/g,
//     lower:true,
//     trim:true,
// });

CategoriesController.post(
  "/Mainedit",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      console.log("here we are");
      const { body } = request;
      console.log(body);
      if (JSON.stringify(body) !== "{}") {
        // let categoriesData = new CategoriesModel(body);
        // console.log(categoriesData);
        await CategoriesModel.syncIndexes();
        const updateData = await CategoriesModel.findOneAndUpdate(
          { _id: body._id },
          {
            $set: {
              slug: body.slug,
              name: body.name,
              description: body.description,
              tags: body.tags,
            },
          }
        );
        response.send({
          status: 201,
          msg: "Data Update successfully...",
          updateData,
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
CategoriesController.get(
  "/detailsSlug",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      console.log("here we are");
      const { body } = request;
      console.log(body);
      if (JSON.stringify(body) !== "{}") {
        // await ProductModel.syncIndexes();
        const findData = await CategoriesModel.aggregate([
          { $match: { slug: { $regex: body.slug, $options: "im" } } },

          {
            $lookup: {
              from: "categories",
              localField: "_id",
              foreignField: "parent_id",
              as: "sub_categories_details",
            },
          },
        ]);
        response.send({
          status: 201,
          msg: "Data find successfully...",
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
