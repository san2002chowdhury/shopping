import { Router } from "express";
import { Authguard } from "../guards";
import { UserController } from "./user";
import { ProductController } from "./product";
import { CategoriesController } from "./categories";
import { CartController } from "./cart";
export const RootController = Router();
console.log("We CONTROLERS");

// RootController.use("/user",Authguard);
RootController.use("/user", UserController);
RootController.use("/product", ProductController);
RootController.use("/categories", CategoriesController);
RootController.use("/cart", CartController);
