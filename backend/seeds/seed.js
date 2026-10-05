import bcrypt from "bcrypt";
// import pool
import pool from "../src/config/database.js";

const createUser = async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const result = await pool.query(
        `INSERT INTO users
        (fullName, email, password, role, avatar)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING userId, fullName, email, role, avatar, createdAt`,
        [
            user.fullName,
            user.email,
            hashedPassword,
            user.role,
            user.avatar
        ]
    );

    return result.rows[0];
};

const seedUsers = async () => {
    try {
        const users = [
            {
                fullName: "Admin ClinicFlow",
                email: "admin@clinicflow.com",
                password: "Admin123",
                role: "admin",
                avatar: null
            },
            {
                fullName: "Staff One",
                email: "staff1@clinicflow.com",
                password: "Staff123",
                role: "staff",
                avatar: null
            },
            {
                fullName: "Staff Two",
                email: "staff2@clinicflow.com",
                password: "Staff123",
                role: "staff",
                avatar: null
            }
        ];

        for (const user of users) {
            const createdUser = await createUser(user);

            console.log(
                `User created: ${createdUser.email}`
            );
        }

    } catch (error) {
        console.error("Seed error:", error);
    } finally {
        await pool.end();
    }
};

seedUsers();