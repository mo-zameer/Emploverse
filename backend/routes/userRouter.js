import express from "express";
import { getUser, register, login, logout, updateProfile, updatePassword, resetPassword } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);  //isAuthenticated runs first then logout
router.get("/getuser", isAuthenticated, getUser); //user can see himself if he's authenticated
router.put("/update/profile", isAuthenticated, updateProfile) //user must be authenticated to update his profile
router.put("/update/password", isAuthenticated, updatePassword)//user must be authenticated to update his password
router.put("/reset/password", isAuthenticated, resetPassword)//user must be authenticated to reset his password

export default router;