import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {deleteApplication, recruiterGetAllApplication, candidateGetAllApplication, postApplication,} from "../controllers/applicationController.js";

const router = express.Router();

router.post("/post/:id", isAuthenticated, isAuthorized("Candidate"), postApplication); //user should be logged in, authorised as Candidate, then he post job application
router.get("/recruiter/getall", isAuthenticated, isAuthorized("Recruiter"), recruiterGetAllApplication); //recruiter will see all applications sent by candidate
router.get("/candidate/getall", isAuthenticated, isAuthorized("Candidate"), candidateGetAllApplication);//candidate will see all his applications sent to recruiter
router.delete("/delete/:id", isAuthenticated, deleteApplication); //delete application by candidate/recruiter

export default router;