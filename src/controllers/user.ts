import e, {
  Router,
  Request,
  Response,
  NextFunction,
  request,
  response,
} from "express";
import { UserModel } from "../models/user";
const { hashPassword } = require("../services/hash");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
import dotenv from "dotenv";
dotenv.config();
var jwt = require("jsonwebtoken");
let key = "SantanuEcom20022024projectBACKEND";
let tokenType = "Bearer";
import { check, body, validationResult } from "express-validator";
var slugify = require("slugify");
import { remove, result } from "lodash";
import { json } from "body-parser";
export const UserController = Router();
import { Authguard } from "../guards";
//API ---------SIGNUP/--LOGIN/--/SEARCH----
//SIGNUP-----------------------------------
UserController.post(
  "/signup",
  body("email", "Invalid Email").isEmail(),
  check("fname").not().isEmpty().withMessage("Name is Mandetory"),
  check("lname").not().isEmpty().withMessage("Name is Mandetory"),
  check("phone").not().isEmpty().withMessage("phone number is Mandetory"),
  check("password").not().isEmpty().withMessage("password is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("pasword should be min 6 length"),
  body("password")
    .isLength({ max: 16 })
    .withMessage("password should be max 16 length"),
  // check("slug").not().isEmpty().withMessage("Slug is Mandetory"),
  async (request: Request, response: Response, next: NextFunction) => {
    console.log("-----We Are In SignUp----");
    const errors = validationResult(request);
    console.log("error>>>>>>>>>>>>", errors);
    if (!errors.isEmpty()) {
      return response.status(400).send({
        result: "error",
        errors: errors.array(),
      });
    } else {
      try {
        const { body } = request;
        console.log("Your given data------>", body);
        await UserModel.syncIndexes();
        const emailFound = await UserModel.find({ email: body.email });
        // console.log("Value-------->",emailFound);
        if (JSON.stringify(emailFound) !== "[]") {
          response.status(404).send({
            result: "Email Is Already In DataBase",
          });
        } else {
          console.log("We Are In else block--->");
          body.password = await bcrypt.hash(body.password, 10);
          // body.slug=await  slugify(body.slug,{
          //     replacement:'-',
          //     remove:/' '/g,
          //     lower:true,
          //     trim:true,
          // });
          let userData = new UserModel(body);
          userData.save(async (err, data) => {
            if (data) {
              response.status(200).send({
                result: "Signup successfully done",
                data,
              });
            } else if (err) throw err;
          });
        }
      } catch (err) {
        next(err);
      }
    }
  }
);

UserController.post(
  "/login",
  check("password").not().isEmpty().withMessage("Password is required"),
  async (request: Request, response: Response, next: NextFunction) => {
    console.log("-----we are in------");

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(200).send({
        errors: errors.array(),
      });
    } else {
      try {
        const { body } = request;
        console.log("body>>>>>", body);
        if (body.email !== "" || body.phone !== "") {
          console.log("body>>>if>>");

          const user = await UserModel.findOne({
            $or: [{ email: body.email }, { phone: body.phone }],
          });
          console.log("data>>>>>>", user);
          if (!user || !(await bcrypt.compare(body.password, user.password))) {
            return response.status(401).json({ message: "Invalid  password" });
          }

          const payload = {
            id: user._id,
            name: user["name"],
            email: user["email"],
            phone: user["phone"],
          };

          const accessToken = jwt.sign(payload, key, {
            expiresIn: "10d",
          });

          response.status(200).send({
            result: "Login successfully done ",
            data: {
              payload,
              token: accessToken,
            },
          });
        } else {
          response.status(200).send({
            comonerr: "Required phone or email",
          });
        }
      } catch (error) {
        next(error);
      }
    }
  }
);

UserController.post(
  "/forgotPassword",
  Authguard,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      console.log("====We Are In Forgot Password Route===");
      const { email } = request.body;
      console.log(body);

      const checkUser = await UserModel.find({ email: email });
      // console.log(checkUser);
      if (JSON.stringify(checkUser) === "[]") {
        return response.status(400).send("User Not Found");
      } else {
        const accessToken = jwt.sign({ email }, key, {
          expiresIn: "10d",
        });
        // console.log(accessToken);
        const transporter = await nodemailer.createTransport({
          service: "Gmail",
          secure: true,
          auth: {
            user: process.env.MY_GMAIL,
            pass: process.env.MY_PASSWORD,
          },
        });
        const receiver = {
          from: "santanuchow2@gmail.com",
          to: email,
          subject: "Password Reset Request....!",
          text: `Password reset link to generate your new password ${process.env.CLIENT_URL}/reset-password/${accessToken}`,
        };
        await transporter.sendMail(receiver);
        return response.send({
          status: 200,
          msg: "Password Reset Link Send Successfully.....",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);
