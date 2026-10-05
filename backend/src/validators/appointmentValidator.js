import { z } from "zod";

export const createAppointmentSchema = z.object({
    patientid: z.string().uuid(),
    appointmentdate: z.coerce.date(),
    reason: z.string().min(1),
    status: z.enum([
        "pending",
        "confirmed",
        "cancelled"
    ])
});

export const updateAppointmentSchema = z.object({
    patientid: z.string().uuid(),
    appointmentdate: z.coerce.date(),
    reason: z.string().min(1),
    status: z.enum([
        "pending",
        "confirmed",
        "cancelled"
    ])
});



