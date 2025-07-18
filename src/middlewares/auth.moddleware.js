import { JsonWebTokenError } from "jsonwebtoken";
import { statusCodes } from "../controllers/codes";
import { model } from "mongoose";
const jwt = require('jsonwebtoken');

function auth (req, res, next){
    const token = req.headers.authorization.split(" ")[1];
    if(!token){
        return res.status(statusCodes.clientError.badReq).json({message:"You need a token 我的朋友！🦾🦾"})
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        return res.status(statusCodes.clientError.badReq).json({message:"You token has been expired! 😿🙀"})
    }
}
module.exports = auth;