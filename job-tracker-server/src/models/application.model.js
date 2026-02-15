import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    role: {
      type: String,
      required: [true, "Job role is required"],
      trim: true,
      maxlength: [100, "Role cannot exceed 100 characters"],
    },
    jobLocation: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["Applied", "Interview", "Rejected", "Offer"],
        message: "Status must be: Applied, Interview, Rejected, or Offer",
      },
      default: "Applied",
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    salaryRange: {
      type: String,
      trim: true,
      maxlength: [50, "Salary range cannot exceed 50 characters"],
      default: null,
    },
    jobLink: {
      type: String,
      trim: true,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
      default: null,
    },
  },
  { timestamps: true },
);

applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ user: 1, appliedDate: -1 });

const Application = mongoose.model("Application", applicationSchema);
export default Application;
