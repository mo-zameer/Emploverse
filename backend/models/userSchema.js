import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [1, "Name must contain atleast 1 character."],
    maxLength: [30, "Name cannot exceed 30 characters."],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please provide a valid email."], //if true email is validated else the message
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  niches: {
    firstNiche: String,
    secondNiche: String,
    thirdNiche: String,
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password must contain atleast 8 chatacters."],
    maxLength: [32, "Password cannot exceed 32 characters."],
    select: false //so that when user is fetched, password should not be shown
  },
  resume: {
    public_id: String, 
    url: String, //link of resume
  },
  coverLetter: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ["Candidate", "Recruiter"], //enum is used to define allowed values
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) { //pre-saving
  if (!this.isModified("password")) { //if password not modified
    next();
  }
  this.password = await bcrypt.hash(this.password, 10); //if modified then hash it 10salt rounds
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJWTToken = function () { //getJWTToken is called by jwtToken.js from utils for token generation
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, { //id is from user which is unique, secret key =random letters
    expiresIn: process.env.JWT_EXPIRE, //7days
  });
};

export const User = mongoose.model("User", userSchema); //User is the model name