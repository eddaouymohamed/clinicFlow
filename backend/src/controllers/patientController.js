import {
    createPatient,
    getPatients,
    getPatientById,
     updatePatient,
    deletePatient
} from "../services/patientService.js";

import { createPatientSchema,updatePatientSchema } from "../validators/patientValidator.js";

export const createPatientController = async (req, res) => {
    try {
        const validatedData = await createPatientSchema.parseAsync(req.body);

        const patient = await createPatient(validatedData);

        res.status(201).json({
            message: "Patient created successfully",
            patient
        });

    } catch (error) {
        console.error(error);

        if (error.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.issues
            });
        }

        if (error.code === "23505") {
            return res.status(409).json({
                message: "CIN already exists"
            });
        }

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const getPatientsController = async (req, res) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await getPatients(search, page, limit);

        res.status(200).json(result);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
export const getPatientByIdController = async (req, res) => {
    try {
        const { patientid } = req.params;

        const patient = await getPatientById(patientid);

        res.status(200).json({
            patient
        });

    } catch (error) {
        console.error(error);

        if (error.message === "Patient not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
export const updatePatientController = async (req, res) => {
    try {
        const { patientid } = req.params;

        const validatedData = await updatePatientSchema.parseAsync(req.body);

        const patient = await updatePatient(patientid, validatedData);

        res.status(200).json({
            message: "Patient updated successfully",
            patient
        });

    } catch (error) {
        console.error(error);

        if (error.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.issues
            });
        }

        if (error.message === "Patient not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        if (error.code === "23505") {
            return res.status(409).json({
                message: "CIN already exists"
            });
        }

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
export const deletePatientController = async (req, res) => {
    try {
        const { patientid } = req.params;

        const patient = await deletePatient(patientid);

        res.status(200).json({
            message: "Patient deleted successfully",
            patient
        });

    } catch (error) {
        console.error(error);

        if (error.message === "Patient not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};