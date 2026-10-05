import { z } from "zod";

export const createPatientSchema = z.object({
    fullname: z.string().min(2),
    cin: z.string().min(3),
    birthdate: z.string(),
    phone: z.string().min(6),
    address: z.string().min(1)
});
export const updatePatientSchema = z.object({
    fullname: z.string().min(2),
    cin: z.string().min(3),
    birthdate: z.string(),
    phone: z.string().min(6),
    address: z.string().min(1)
});