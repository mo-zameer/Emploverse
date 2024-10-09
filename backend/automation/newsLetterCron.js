import cron from "node-cron";
import { Job } from "../models/jobSchema.js";
import { User } from "../models/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";

export const newsLetterCron = () => {
  cron.schedule("*/1 * * * *", async () => { //5*, runs every 1 min, 0 hrs days months weekdays
    console.log("Running Cron Automation"); //runs every min //will run even server is down
    const jobs = await Job.find({ newsLettersSent: false }); //for whoever newsLetter was sent
    for (const job of jobs) {
      try {
        const filteredUsers = await User.find({ //find users
          $or: [ //filters query, return true if any one of them is true
            { "niches.firstNiche": job.jobNiche },
            { "niches.secondNiche": job.jobNiche },
            { "niches.thirdNiche": job.jobNiche },
          ],
        });
        for (const user of filteredUsers) { //run loop for filtered users
          const subject = `Hot Job Alert: ${job.title} in ${job.jobNiche} Available Now`;
          const message = `Hi ${user.name},\n\nGreat news! A new job that fits your niche has just been posted. The position is for a ${job.title} with ${job.companyName}, and they are looking to hire immediately.\n\nJob Details:\n- **Position:** ${job.title}\n- **Company:** ${job.companyName}\n- **Location:** ${job.location}\n- **Salary:** ${job.salary}\n\nDon’t wait too long! Job openings like these are filled quickly. \n\nWe’re here to support you in your job search. Best of luck!\n\nBest Regards,\nEmploverse Team`;
          sendEmail({
            email: user.email,
            subject,
            message,
          });
        }
        job.newsLettersSent = true; //newsLetter sent
        await job.save();
      } catch (error) {
        console.log("ERROR IN NODE CRON CATCH BLOCK");
        return next(console.error(error || "Some error in Cron."));
      }
    }
  });
};