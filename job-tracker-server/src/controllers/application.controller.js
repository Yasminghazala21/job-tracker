import Application from "../models/application.model.js";

export const createApplication = async (req, res, next) => {
  try {
    const {
      companyName,
      role,
      jobLocation,
      salaryRange,
      jobLink,
      status,
      notes,
      appliedDate,
    } = req.body;

    const application = await Application.create({
      user: req.user._id,
      companyName,
      role,
      jobLocation,
      salaryRange,
      jobLink,
      status,
      notes,
      appliedDate,
    });

    res.status(201).json({
      success: true,
      message: "Application created successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const { status, search, sort, page = 1, limit = 10 } = req.query;

    const queryObj = { user: req.user._id };

    if (status) {
      const statusArray = status.split(",").map((s) => s.trim());
      queryObj.status = { $in: statusArray };
    }

    if (search) {
      queryObj.companyName = { $regex: search, $options: "i" };
    }

    const sortObj = {};
    if (sort === "oldest") {
      sortObj.appliedDate = 1;
    } else {
      sortObj.appliedDate = -1;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [applications, totalCount] = await Promise.all([
      Application.find(queryObj).sort(sortObj).skip(skip).limit(limitNum),
      Application.countDocuments(queryObj),
    ]);

    res.status(200).json({
      success: true,
      count: applications.length,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }

    if (application.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error(
        "Not authorized — this application does not belong to you",
      );
    }

    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }

    if (application.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error(
        "Not authorized — you can only update your own applications",
      );
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after", runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Application updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }

    if (application.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error(
        "Not authorized — you can only delete your own applications",
      );
    }

    await Application.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    next(error);
  }
};
