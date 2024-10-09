import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import { v2 as cloudinary } from "cloudinary";

//POST JOb Application , candidate trying to fill and apply for jobs
export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; //getting job id from params
  const { name, email, phone, address, coverLetter } = req.body; //taking in input
  if (!name || !email || !phone || !address || !coverLetter) {
    return next(new ErrorHandler("All fields are required.", 400));
  }
  const candidateInfo = {
    id: req.user._id, //getting id from logged in information
    name,
    email,
    phone,
    address,
    coverLetter,
    role: "Candidate",
  };
  const jobDetails = await Job.findById(id); 
  if (!jobDetails) { //if job not exists throw error
    return next(new ErrorHandler("Job not found.", 404));
  }
  const isAlreadyApplied = await Application.findOne({ //checking if already exists
    "jobInfo.jobId": id, //from jobInfo and params.id
    "candidateInfo.id": req.user._id,
  });
  if (isAlreadyApplied) {
    return next(
      new ErrorHandler("You have already applied for this job.", 400)
    );
  }
  if (req.files && req.files.resume) { //if user is sending a file && it is named as resume
    const { resume } = req.files; //destructuring & store the file in db
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath,
        {
          folder: "Candidate_Resume", //storing in a folder named caandidate_resume
        }
      );
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        return next(
          new ErrorHandler("Failed to upload resume to cloudinary.", 500) //internal server error
        );
      }
      candidateInfo.resume = { //adding resume to candidateInfo
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    } catch (error) {
      return next(new ErrorHandler("Failed to upload resume", 500));
    }
  } else {
    if (req.user && !req.user.resume.url) { //if user uploaded resume while registering and db doesn't have it's url, throw err  or
      return next(new ErrorHandler("Please upload your resume.", 400));
    }
    candidateInfo.resume = { //if url exists, add resume to candidateInfo
      public_id: req.user && req.user.resume.public_id,
      url: req.user && req.user.resume.url,
    };
  }
  const recruiterInfo = { //recruiter info
    id: jobDetails.postedBy, //from jobSchema jobDetails
    role: "Recruiter",
  };
  const jobInfo = { //job info
    jobId: id,  //from params.id
    jobTitle: jobDetails.title,
  };
  const application = await Application.create({ //creating application
    candidateInfo,
    recruiterInfo,
    jobInfo,
  });
  res.status(201).json({
    success: true,
    message: "Application submitted.",
    application,
  });
});

//GET applications for recruiter
export const recruiterGetAllApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { _id } = req.user; //destructuring id from mongo db
    const applications = await Application.find({
      "recruiterInfo.id": _id, //comparing ID of job posted by recruiter and the recruiter logged din is same
      "deletedBy.recruiter": false, //recruiter can see applications which he has not deleted
    });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

//GET applications for candidate
export const candidateGetAllApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { _id } = req.user; //destructuring id from mongo db
    const applications = await Application.find({
      "candidateInfo.id": _id,
      "deletedBy.candidate": false, //candidate can see applications which he has not deleted
    });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

//Deleting appliation
export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; //id of application from params
  const application = await Application.findById(id); //finding
  if (!application) { //if does not exist throw err
    return next(new ErrorHandler("Application not found.", 404));
  }
  const { role } = req.user;
  switch (role) {
    case "Candidate": //if deleted by candidate
      application.deletedBy.candidate = true;
      await application.save();
      break;
    case "Recruiter": //if deleted by recruiter
      application.deletedBy.recruiter = true;
      await application.save();
      break;

    default:
      console.log("Default case for application delete function.");
      break;
  }

  if (
    application.deletedBy.recruiter === true && //if deleted by both
    application.deletedBy.candidate === true
  ) {
    await application.deleteOne(); //delete from db
  }
  res.status(200).json({
    success: true,
    message: "Application Deleted.",
  });
});