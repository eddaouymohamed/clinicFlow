







import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";

export const loginUser = async (email, password) => {
    const result = await pool.query(
        `SELECT
            userid AS "userId",
            fullname AS "fullName",
            email,
            password,
            role,
            avatar,
            createdat AS "createdAt"
         FROM users
         WHERE email = $1`,
        [email]
    );

    const user = result.rows[0];

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        {
            userId: user.userId,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return {
        user: {
            userId: user.userId,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            createdAt: user.createdAt
        },
        token
    };
};

export const getCurrentUser = async (userId) => {
    const result = await pool.query(
        `SELECT
            userid AS "userId",
            fullname AS "fullName",
            email,
            role,
            avatar,
            createdat AS "createdAt"
         FROM users
         WHERE userid = $1`,
        [userId]
    );

    const user = result.rows[0];

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};























// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import pool from "../config/database.js";

// export const loginUser = async (email, password) => {
//     const result = await pool.query(
//         `SELECT userId, fullName, email, password, role, avatar, createdAt
//          FROM users
//          WHERE email = $1`,
//         [email]
//     );

//     const user = result.rows[0];

//     if (!user) {
//         throw new Error("Invalid email or password");
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//         throw new Error("Invalid email or password");
//     }

//     const token = jwt.sign(
//         {
//             userId: user.userId,
//             role: user.role
//         },
//         process.env.JWT_SECRET,
//         {
//             expiresIn: "1d"
//         }
//     );

//     return {
//         user: {
//             userId: user.userId,
//             fullName: user.fullName,
//             email: user.email,
//             role: user.role,
//             avatar: user.avatar,
//             createdAt: user.createdAt
//         },
//         token
//     };
// };

// export const getCurrentUser = async (userId) => {
//     const result = await pool.query(
//         `SELECT userId, fullName, email, role, avatar, createdAt
//          FROM users
//          WHERE userId = $1`,
//         [userId]
//     );

//     const user = result.rows[0];

//     if (!user) {
//         throw new Error("User not found");
//     }

//     return user;
// };