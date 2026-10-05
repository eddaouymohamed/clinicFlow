import express from "express";

import {
    createAppointmentController,
    getAppointmentsController,
    getAppointmentByIdController,
    updateAppointmentController,
    deleteAppointmentController
} from "../controllers/appointmentController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createAppointmentController
);

router.get(
    "/",
    authMiddleware,
    getAppointmentsController
);

router.get(
    "/:appointmentid",
    authMiddleware,
    getAppointmentByIdController
);

router.put(
    "/:appointmentid",
    authMiddleware,
    updateAppointmentController
);

router.delete(
    "/:appointmentid",
    authMiddleware,
    deleteAppointmentController
);

export default router;