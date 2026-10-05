import pool from "../config/database.js";

export const createAppointment = async (appointment) => {
    const {
        patientid,
        createdby,
        appointmentdate,
        reason,
        status
    } = appointment;

    const result = await pool.query(
        `INSERT INTO appointments
        (patientid, createdby, appointmentdate, reason, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING appointmentid,
                  patientid,
                  createdby,
                  appointmentdate,
                  reason,
                  status,
                  createdat`,
        [
            patientid,
            createdby,
            appointmentdate,
            reason,
            status
        ]
    );

    return result.rows[0];
};

export const getAppointments = async (
    search = "",
    status = "",
    page = 1,
    limit = 10
) => {
    const offset = (page - 1) * limit;

    const values = [];
    const conditions = [];

    if (search) {
        values.push(`%${search}%`);

        conditions.push(`
            (
                a.reason ILIKE $${values.length}
                OR p.fullname ILIKE $${values.length}
                OR p.cin ILIKE $${values.length}
            )
        `);
    }

    if (status) {
        values.push(status);

        conditions.push(
            `a.status = $${values.length}`
        );
    }

    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

    const limitPosition = values.length + 1;
    const offsetPosition = values.length + 2;

    const appointmentsResult = await pool.query(
        `SELECT
            a.appointmentid,
            a.patientid,
            a.createdby,
            a.appointmentdate,
            a.reason,
            a.status,
            a.createdat
         FROM appointments a
         JOIN patients p
           ON p.patientid = a.patientid
         ${whereClause}
         ORDER BY a.appointmentdate ASC
         LIMIT $${limitPosition}
         OFFSET $${offsetPosition}`,
        [
            ...values,
            limit,
            offset
        ]
    );

    const countResult = await pool.query(
        `SELECT COUNT(*) AS total
         FROM appointments a
         JOIN patients p
           ON p.patientid = a.patientid
         ${whereClause}`,
        values
    );

    const total = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    return {
        appointments: appointmentsResult.rows,
        total,
        page,
        limit,
        totalPages
    };
};

export const getAppointmentById = async (appointmentid) => {
    const result = await pool.query(
        `SELECT
            appointmentid,
            patientid,
            createdby,
            appointmentdate,
            reason,
            status,
            createdat
         FROM appointments
         WHERE appointmentid = $1`,
        [appointmentid]
    );

    const appointment = result.rows[0];

    if (!appointment) {
        throw new Error("Appointment not found");
    }

    return appointment;
};

export const updateAppointment = async (
    appointmentid,
    appointment
) => {
    const {
        patientid,
        appointmentdate,
        reason,
        status
    } = appointment;

    const result = await pool.query(
        `UPDATE appointments
         SET patientid = $1,
             appointmentdate = $2,
             reason = $3,
             status = $4
         WHERE appointmentid = $5
         RETURNING appointmentid,
                   patientid,
                   createdby,
                   appointmentdate,
                   reason,
                   status,
                   createdat`,
        [
            patientid,
            appointmentdate,
            reason,
            status,
            appointmentid
        ]
    );

    const updatedAppointment = result.rows[0];

    if (!updatedAppointment) {
        throw new Error("Appointment not found");
    }

    return updatedAppointment;
};

export const deleteAppointment = async (appointmentid) => {
    const result = await pool.query(
        `DELETE FROM appointments
         WHERE appointmentid = $1
         RETURNING appointmentid`,
        [appointmentid]
    );

    const deletedAppointment = result.rows[0];

    if (!deletedAppointment) {
        throw new Error("Appointment not found");
    }

    return deletedAppointment;
};