import pool from "../config/database.js";

export const createPatient = async (patient) => {
    const {
        fullname,
        cin,
        birthdate,
        phone,
        address
    } = patient;

    const result = await pool.query(
        `INSERT INTO patients
        (fullname, cin, birthdate, phone, address)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING patientid, fullname, cin, birthdate, phone, address, createdat`,
        [
            fullname,
            cin,
            birthdate,
            phone,
            address
        ]
    );

    return result.rows[0];
};

export const getPatients = async (search = "", page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const searchValue = `%${search}%`;

    const patientsResult = await pool.query(
        `SELECT patientid, fullname, cin, birthdate, phone, address, createdat
         FROM patients
         WHERE fullname ILIKE $1
            OR cin ILIKE $1
         ORDER BY createdat DESC
         LIMIT $2 OFFSET $3`,
        [searchValue, limit, offset]
    );

    const countResult = await pool.query(
        `SELECT COUNT(*) AS total
         FROM patients
         WHERE fullname ILIKE $1
            OR cin ILIKE $1`,
        [searchValue]
    );

    const total = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    return {
        patients: patientsResult.rows,
        total,
        page,
        limit,
        totalPages
    };
};
export const getPatientById = async (patientid) => {
    const result = await pool.query(
        `SELECT patientid, fullname, cin, birthdate, phone, address, createdat
         FROM patients
         WHERE patientid = $1`,
        [patientid]
    );

    const patient = result.rows[0];

    if (!patient) {
        throw new Error("Patient not found");
    }

    return patient;
};
export const updatePatient = async (patientid, patient) => {
    const {
        fullname,
        cin,
        birthdate,
        phone,
        address
    } = patient;

    const result = await pool.query(
        `UPDATE patients
         SET fullname = $1,
             cin = $2,
             birthdate = $3,
             phone = $4,
             address = $5
         WHERE patientid = $6
         RETURNING patientid, fullname, cin, birthdate, phone, address, createdat`,
        [
            fullname,
            cin,
            birthdate,
            phone,
            address,
            patientid
        ]
    );

    const updatedPatient = result.rows[0];

    if (!updatedPatient) {
        throw new Error("Patient not found");
    }

    return updatedPatient;
};
export const deletePatient = async (patientid) => {
    const result = await pool.query(
        `DELETE FROM patients
         WHERE patientid = $1
         RETURNING patientid`,
        [patientid]
    );

    const deletedPatient = result.rows[0];

    if (!deletedPatient) {
        throw new Error("Patient not found");
    }

    return deletedPatient;
};