import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
    
    //candidate info
    candidateInfo: { 
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please provide a valid email."],
      },
      phone: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      resume: {
        public_id: String,
        url: String,
      },
      coverLetter: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ["Candidate"], //user application
        required: true,
      },
    },

    //recruiter Info
    recruiterInfo: { 
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      role: {
        type: String,
        enum: ["Recruiter"],
        required: true,
      },
    },

    //Job  Info
    jobInfo: {
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      jobTitle: {
        type: String,
        required: true,
      },
    },

    //Deleted By who
    deletedBy: {
      candidate: {
        type: Boolean,
        default: false,
      },
      recruiter: {
        type: Boolean,
        default: false,
      },
    },
})

export const Application = mongoose.model("Application", applicationSchema)