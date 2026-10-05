import express from "express";

import {
    getDashboardStatsController,
} from "../controllers/dashboardController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    getDashboardStatsController
);

export default router;