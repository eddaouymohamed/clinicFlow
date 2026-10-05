
import {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
} from "../services/appointmentService.js";

import {
    createAppointmentSchema,
    updateAppointmentSchema
} from "../validators/appointmentValidator.js";

export const createAppointmentController = async (req, res) => {
    try {
        const validatedData =
            await createAppointmentSchema.parseAsync(req.body);

        const createdby = req.user?.userId;

        if (!createdby) {
            return res.status(401).json({
                message: "User ID not found in token"
            });
        }

        const appointment = await createAppointment({
            patientid: validatedData.patientid,
            createdby: createdby,
            appointmentdate: validatedData.appointmentdate,
            reason: validatedData.reason,
            status: validatedData.status
        });

        res.status(201).json({
            message: "Appointment created successfully",
            appointment
        });

    } catch (error) {
        console.error(error);

        if (error.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.issues
            });
        }

        if (error.code === "23503") {
            return res.status(404).json({
                message: "Patient or user not found"
            });
        }

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const getAppointmentsController = async (req, res) => {
    try {
        const search = req.query.search || "";
        const status = req.query.status || "";

        const page = Math.max(
            Number(req.query.page) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                Number(req.query.limit) || 10,
                1
            ),
            100
        );

        const result = await getAppointments(
            search,
            status,
            page,
            limit
        );

        res.status(200).json(result);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const getAppointmentByIdController = async (req, res) => {
    try {
        const { appointmentid } = req.params;

        const appointment =
            await getAppointmentById(appointmentid);

        res.status(200).json({
            appointment
        });

    } catch (error) {
        console.error(error);

        if (error.message === "Appointment not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const updateAppointmentController = async (req, res) => {
    try {
        const { appointmentid } = req.params;

        const validatedData =
            await updateAppointmentSchema.parseAsync(req.body);

        const appointment = await updateAppointment(
            appointmentid,
            validatedData
        );

        res.status(200).json({
            message: "Appointment updated successfully",
            appointment
        });

    } catch (error) {
        console.error(error);

        if (error.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.issues
            });
        }

        if (error.message === "Appointment not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        if (error.code === "23503") {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const deleteAppointmentController = async (req, res) => {
    try {
        const { appointmentid } = req.params;

        const appointment =
            await deleteAppointment(appointmentid);

        res.status(200).json({
            message: "Appointment deleted successfully",
            appointment
        });

    } catch (error) {
        console.error(error);

        if (error.message === "Appointment not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};