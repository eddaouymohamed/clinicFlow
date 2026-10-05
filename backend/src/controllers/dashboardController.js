import { getDashboardStats } from "../services/dashboardService.js";

export const getDashboardStatsController = async (req, res, next) => {
    try {
        const stats = await getDashboardStats();

        res.status(200).json({
            success: true,
            message: "Dashboard statistics retrieved successfully",
            ...stats,
        });
    } catch (error) {
        next(error);
    }
};