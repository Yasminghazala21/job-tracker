import express from "express";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "../controllers/application.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getApplications).post(createApplication);
router
  .route("/:id")
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

export default router;
