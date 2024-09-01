// import { CryproHelper, TokensHelper, AppException, StatusCodes  } from '@401_digital/xrm-core';
import dotenv from "dotenv";
import e, { Router,Request,Response,NextFunction,request,response } from "express";
import { json } from "body-parser";
import { UserController } from "../controllers/user";
import { UserModel } from "../models";
var jwt=require('jsonwebtoken');
let key="SantanuEcom20022024projectBACKEND";
let tokenType='Bearer';
import {check,body,validationResult} from "express-validator";
// import { UserModel } from "../models";
var ObjectId = require('mongodb').ObjectId;

export const Authguard = async (req, res, next) => {
    try {
        const authorization = req.headers['authorization'];
        console.log("================WE ARE IN AUTH============");
        console.log("this is -------->",authorization);
        if (!req.headers['authorization']) {
            throw new Error('User is not authorised');
        }else{
            const payload = await jwt.verify(authorization, key);
            console.log("payload>>>>>>",payload)
            // Find user
            let user = await UserModel.findOne({ email: payload.email });
            console.log("auth>>>>>>>>>>>",user);
            res.send({
                status:200,
                user,
            });
            if (!user) { throw new Error('No user found'); }
            // if (user['isdelete'] === true) {
            //     throw new Error('Your account has been De-Activated. Please contact Admin.');
            // }
        }
        next();
    } catch (error) {
        next(error);
    }
}

// const jwt = require("jsonwebtoken");
// let key = "SantanuEcom20022024projectBACKEND";

// export const Authguard = async (req, res, next) => {
//   const token = req.header("x-auth-token");

//   if (!token) {
//     return res.status(401).json({ msg: "No token, authorization denied" });
//   }

//   try {
//     const decoded = jwt.verify(token, key);
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: "Token is not valid" });
//   }
// };
