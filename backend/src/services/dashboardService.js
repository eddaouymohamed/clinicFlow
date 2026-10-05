import pool from "../config/database.js";

export const getDashboardStats = async () => {
    const result = await pool.query(`
        SELECT
            (SELECT COUNT(*)
             FROM patients) AS "totalPatients",

            (SELECT COUNT(*)
             FROM appointments
             WHERE DATE(appointmentdate) = CURRENT_DATE)
             AS "todayAppointments",

            (SELECT COUNT(*)
             FROM appointments
             WHERE status = 'pending')
             AS "pendingAppointments",

            (SELECT COUNT(*)
             FROM appointments
             WHERE status = 'confirmed')
             AS "confirmedAppointments"
    `);

    const stats = result.rows[0];

    return {
        totalPatients: Number(stats.totalPatients),
        todayAppointments: Number(stats.todayAppointments),
        pendingAppointments: Number(stats.pendingAppointments),
        confirmedAppointments: Number(stats.confirmedAppointments),
    };
};