import { loginUser, getCurrentUser } from "../services/authService.js";
import { loginSchema } from "../validators/authValidator.js";

export const login = async (req, res) => {
    try {
        const validatedData = await loginSchema.parseAsync(req.body);

        const { email, password } = validatedData;

        const result = await loginUser(email, password);

        res.status(200).json(result);

    } catch (error) {
        console.error(error);

        if (error.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.issues
            });
        }

        if (error.message === "Invalid email or password") {
            return res.status(401).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await getCurrentUser(req.user.userId);

        res.status(200).json({
            user
        });

    } catch (error) {
        console.error(error);

        if (error.message === "User not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
export const logout = async (req, res) => {
    res.status(200).json({
        message: "Logout successful"
    });
};