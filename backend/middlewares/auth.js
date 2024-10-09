import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies; //get the cookies and name is token
  if (!token) { //if token not found
    return next(new ErrorHandler("User is not authenticated.", 400));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); //decoding the token and verifying whether token was created by secret variable

  req.user = await User.findById(decoded.id); //get user id who is already logged in

  next(); //next function runs
});

export const isAuthorized = (...roles) => { //accepts roles
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) { //includes works only on searching string
      return next(
        new ErrorHandler(
          `${req.user.role} not allowed to access this resource.`
        )
      );
    }
    next();
  };
};