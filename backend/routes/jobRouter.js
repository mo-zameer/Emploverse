import express from "express"
import {isAuthenticated, isAuthorized} from '../middlewares/auth.js'
import {postJob, getAllJobs, getMyJobs, deleteJob, getASingleJob} from '../controllers/jobController.js'

const router = express.Router()

router.post('/post', isAuthenticated ,isAuthorized("Recruiter"), postJob) //isAuthenticated= checks if he is logged in and isAuthorized checks user's role
router.get("/getall", getAllJobs); //get all jobs posted
router.get("/getmyjobs", isAuthenticated, isAuthorized("Recruiter"), getMyJobs); //get jobs posted by me
router.delete("/delete/:id", isAuthenticated, isAuthorized("Recruiter"), deleteJob); //delete the job i posted, :id is accessible from params
router.get("/get/:id", getASingleJob) //get specific job

export default router