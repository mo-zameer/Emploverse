import express from "express"
import { config } from 'dotenv'
import cors from "cors" //for frontend and backend connection (Cross-Origin resoursce sharing)
import cookieParser from "cookie-parser"
import { connection } from "./database/connection.js"
import {errorMiddleware} from "./middlewares/error.js"
import fileUpload from "express-fileupload"
import userRouter from './routes/userRouter.js'
import jobRouter from './routes/jobRouter.js'
import applicationRouter from './routes/applicationRouter.js'
import { newsLetterCron } from "./automation/newsLetterCron.js"

const app = express()
config({path: "./config/config.env"}) //setting the path for env file

//Middlewares
app.use(cors({
    origin: [process.env.FRONTEND_URL], //writing the frontend url
    methods: ["GET","POST", "PUT", "DELETE"], //we are manipulating data to frontend  or from babckend
    credentials: true, //sending data through POST
})) 


app.use(cookieParser()) //Accessing of jwt token in backend

app.use(express.json()); //converts string data to json object
app.use(express.urlencoded({ extended: true })); //type of data should be urlencoded

app.use(fileUpload({ //used for uploading resume to cloudinary
    useTempFiles: true,
    tempFileDir: "/tmp/",
}))

//setting up routes
app.use("/api/v1/user", userRouter); //for userData
app.use("/api/v1/job", jobRouter); //for jobData
app.use("/api/v1/application", applicationRouter); //for job application data

//cron sheduling
newsLetterCron()

//DB Connect
connection()

//ErrorHandler
app.use(errorMiddleware);

export default app;