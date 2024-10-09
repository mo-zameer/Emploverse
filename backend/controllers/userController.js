import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";

//Function for taking in userData and registering user
export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      password,
      role,
      firstNiche,
      secondNiche,
      thirdNiche,
      coverLetter,
    } = req.body; //taking input of all values

    if (!name || !email || !phone || !address || !password || !role) { //if fields are empty throw error
      return next(new ErrorHandler("All fields are required.", 400)); //new should be used before ErrorHandler
    }
    if (role === "Candidate" && (!firstNiche || !secondNiche || !thirdNiche)) { //if role is candidate and he has not entered niches then
      return next(
        new ErrorHandler("Please provide your preferred job niches.", 400)
      );
    }
    const existingUser = await User.findOne({ email }); //check if email is already existing
    if (existingUser) {
      return next(new ErrorHandler("Email is already registered.", 400));
    }
    const userData = { //storing data in userData
      name,
      email,
      phone,
      address,
      password,
      role,
      niches: {
        firstNiche,
        secondNiche,
        thirdNiche,
      },
      coverLetter,
    };
    if (req.files && req.files.resume) { //if resume or file uploaded
      const { resume } = req.files; //store the file as resume
      if (resume) { //upload resume to cloudinary
        try {
          const cloudinaryResponse = await cloudinary.uploader.upload(
            resume.tempFilePath, { folder: "Candidate_Resume" }
          );
          if (!cloudinaryResponse || cloudinaryResponse.error) { //if cloudinary failed to respond then throw error
            return next(
              new ErrorHandler("Failed to upload resume to cloud.", 500)
            );
          }
          userData.resume = { //adding resume to userData object
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
            resource_type: "auto"
          };
        } catch (error) { //uploading resume failed
          return next(new ErrorHandler("Failed to upload resume", 500));
        }
      }
    }
    const user = await User.create(userData); //create user and save in db
    sendToken(user, 201, res, "User Registered."); //sends user data, statuscode, msg
    /*res.status(201).json({
        success:true,
        message: "User Registered."
    })*/
  } catch (error) {
    next(error);
  }
});

//login functionality
export const login = catchAsyncErrors(async (req, res, next) => {
  const { role, email, password } = req.body;
  if (!role || !email || !password) { //if role, email, password are not entered then throw error
    return next(
      new ErrorHandler("Email, password and role are required.", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password"); //select("+password") if password required
  if (!user) { //if user does not exist
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  //if email is correct, comparing password the user entered
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) { //if password doesn't match
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  if (user.role !== role) { //role doesn't matches
    return next(new ErrorHandler("Invalid user role.", 400));
  } //role,email,password matches
  sendToken(user, 200, res, "User logged in successfully.");
});

//logout functionality
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", { //change the token value to ""
      expires: new Date(Date.now()), //setting the token expiry date to now
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});

//Fetching user functionality
export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user; //from auth.js
  res.status(200).json({
    success: true,
    user,
  });
});

//Profile update functionality
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    coverLetter: req.body.coverLetter,
    niches: {
      firstNiche: req.body.firstNiche,
      secondNiche: req.body.secondNiche,
      thirdNiche: req.body.thirdNiche,
    },
  };
  const { firstNiche, secondNiche, thirdNiche } = newUserData.niches; //niches should be destructured

  if (req.user.role === "Candidate" && (!firstNiche || !secondNiche || !thirdNiche)) { //If candidate didn't update niches throw error
    return next(
      new ErrorHandler("Please provide your all preferred job niches.", 400)
    );
  }
  if (req.files) { //if user uploads resume
    const resume = req.files.resume; //destructuring  //or can also be written as const {resume} = req.files
    if (resume) {
      const currentResumeId = req.user.resume.public_id; //currentResume is which was existing before uploading new
      if (currentResumeId) { //if resume found then destroy resume id
        await cloudinary.uploader.destroy(currentResumeId);
      }
      const newResume = await cloudinary.uploader.upload(resume.tempFilePath, { //uploading new resume
        folder: "Candidate_Resume",
      });
      newUserData.resume = { //adding resume to new user data
        public_id: newResume.public_id,
        url: newResume.secure_url,
        resource_type: "auto"
      };
    }
  }

  //finding user id and updating to new user data
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
    message: "Profile updated.",
  });
});

//updating password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password"); //getting user and selecting password manually

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword); //user entering password which is stored as old pass which is passed to iPasswordMatched

  if (!isPasswordMatched) { //if password doesn't match throw an error
    return next(new ErrorHandler("Old password is incorrect.", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) { //if new password and confirm password do not match
    return next(
      new ErrorHandler("New password & confirm password do not match.", 400)
    );
  }

  user.password = req.body.newPassword; //assigning newPassword to user.password(updadted)
  await user.save();
  sendToken(user, 200, res, "Password updated successfully.");
});

//Forgot password and reset password
export const resetPassword = catchAsyncErrors(async(req, res, next)=>{
  const user = await User.findById(req.user.id) //user retrieval
  //const enteredEmail = req.body
  if(req.body.enteredEmail !== user.email){ //Validates email
    return next(
      new ErrorHandler("Email is incorrect.", 400)
    )
  }
  if(req.body.newPassword !== req.body.confirmPassword){ //Validates passwords
    return next(
      new ErrorHandler("New password & confirm Password do not match", 400)
    )
  }
  user.password = req.body.newPassword //Updates password
  await user.save() //Saves user
  sendToken(user, 200, res, "Password reset was successful."); //Sends token
})