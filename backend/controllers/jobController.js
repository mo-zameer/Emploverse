import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";

//Posting Jobs
export const postJob = catchAsyncErrors(async (req, res, next) => {
  const { //taking in data from users
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsiteTitle,
    personalWebsiteUrl,
    jobNiche,
  } = req.body;
  if ( //mandatory to be filled
    !title ||
    !jobType ||
    !location ||
    !companyName ||
    !introduction ||
    !responsibilities ||
    !qualifications ||
    !salary ||
    !jobNiche
  ) {
    return next(new ErrorHandler("Please provide full job details.", 400));
  }
  if (!personalWebsiteUrl) {
    return next(
      new ErrorHandler("Provide the website url of your company", 400)
    );
  }
  const postedBy = req.user._id;
  const job = await Job.create({ //creating job
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsite: { //personalWebsite object
      title: personalWebsiteTitle,
      url: personalWebsiteUrl,
    },
    jobNiche,
    postedBy,
  });
  res.status(201).json({
    success: true,
    message: "Job posted successfully.",
    job,
  });
});

//get all the jobs
export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const { city, niche, searchKeyword } = req.query; //query is after ? in a url
  const query = {};
  if (city) { //adding location to query so that users can find jobs by filtering location
    query.location = city;
  }
  if (niche) { //adding niche to query so that users can find jobs by filtering niche
    query.jobNiche = niche;
  }
  if (searchKeyword) {  //adding title,company,intro to query so that users can find jobs by filtering searchkeyword
    query.$or = [ 
      { title: { $regex: searchKeyword, $options: "i" } },
      { companyName: { $regex: searchKeyword, $options: "i" } },
      { introduction: { $regex: searchKeyword, $options: "i" } },
    ];
  }
  const jobs = await Job.find(query);
  res.status(200).json({
    success: true,
    jobs,
    count: jobs.length,
  });
});

//get Jobs posted by me
export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  const myJobs = await Job.find({ postedBy: req.user._id }); //my id should match with user's id who posted the job
  res.status(200).json({
    success: true,
    myJobs,
  });
});

//Deleting Jobs
export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id); //finding job by ID
  if (!job) { //if not found
    return next(new ErrorHandler("Oops! Job not found.", 404));
  }
  await job.deleteOne(); //delete one job if found
  res.status(200).json({
    success: true,
    message: "Job deleted.",
  });
});

//GET a specific job
export const getASingleJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id); //finding job by ID
  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }
  res.status(200).json({
    success: true,
    job,
  });
});
