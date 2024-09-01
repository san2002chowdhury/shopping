import { Router, Request, Response, NextFunction, request } from "express";
import { ProductModel, UserModel, CartModel, OrderModel } from "../models";
import dotenv from "dotenv";
import { groupBy, result } from "lodash";
dotenv.config();
export const OrderController = Router();
var ObjectId = require("mongodb").ObjectId;
