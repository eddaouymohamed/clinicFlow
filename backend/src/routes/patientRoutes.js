import express from "express";

import {
    createPatientController,
    getPatientsController,
    getPatientByIdController,
    updatePatientController,
    deletePatientController
} from "../controllers/patientController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPatientController);

router.get("/", authMiddleware, getPatientsController);
router.get("/:patientid", authMiddleware, getPatientByIdController);
router.put("/:patientid", authMiddleware, updatePatientController);
router.delete("/:patientid", authMiddleware, deletePatientController);

export default router;