import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const getDashboardStats = createAsyncThunk(
    "dashboard/getDashboardStats",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/dashboard");

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Erreur lors du chargement du dashboard"
            );
        }
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",

    initialState: {
        totalPatients: 0,
        todayAppointments: 0,
        pendingAppointments: 0,
        confirmedAppointments: 0,
        loading: false,
        success: false,
        message: "",
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(getDashboardStats.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.message = "";
                state.error = null;
            })

            .addCase(getDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.totalPatients = action.payload.totalPatients;
                state.todayAppointments = action.payload.todayAppointments;
                state.pendingAppointments = action.payload.pendingAppointments;
                state.confirmedAppointments =
                    action.payload.confirmedAppointments;

                state.message =
                    action.payload.message || "Statistiques chargées";

                state.error = null;
            })

            .addCase(getDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = "";
                state.error = action.payload;
            });
    },
});

export default dashboardSlice.reducer;