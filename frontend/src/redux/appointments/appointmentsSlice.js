import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const getAppointments = createAsyncThunk(
    "appointments/getAppointments",
    async (
        {
            search = "",
            status = "",
            date = "",
            page = 1,
            limit = 10,
        } = {},
        { rejectWithValue }
    ) => {
        try {
            const response = await api.get("/appointments", {
                params: {
                    search,
                    status,
                    date,
                    page,
                    limit,
                },
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Erreur lors du chargement des rendez-vous"
            );
        }
    }
);

export const getAppointmentById = createAsyncThunk(
    "appointments/getAppointmentById",
    async (appointmentId, { rejectWithValue }) => {
        try {
            const response = await api.get(
                `/appointments/${appointmentId}`
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Erreur lors du chargement du rendez-vous"
            );
        }
    }
);

export const createAppointment = createAsyncThunk(
    "appointments/createAppointment",
    async (appointmentData, { rejectWithValue }) => {
        try {
            const response = await api.post(
                "/appointments",
                appointmentData
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Erreur lors de la création du rendez-vous"
            );
        }
    }
);

export const updateAppointment = createAsyncThunk(
    "appointments/updateAppointment",
    async (
        { appointmentId, appointmentData },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.put(
                `/appointments/${appointmentId}`,
                appointmentData
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Erreur lors de la modification du rendez-vous"
            );
        }
    }
);

export const updateAppointmentStatus = createAsyncThunk(
    "appointments/updateAppointmentStatus",
    async (
        { appointmentId, status },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.patch(
                `/appointments/${appointmentId}/status`,
                { status }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Erreur lors de la modification du statut"
            );
        }
    }
);

export const deleteAppointment = createAsyncThunk(
    "appointments/deleteAppointment",
    async (appointmentId, { rejectWithValue }) => {
        try {
            const response = await api.delete(
                `/appointments/${appointmentId}`
            );

            return {
                ...response.data,
                appointmentId,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Erreur lors de la suppression du rendez-vous"
            );
        }
    }
);

const appointmentsSlice = createSlice({
    name: "appointments",

    initialState: {
        appointments: [],
        appointment: null,
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        loading: false,
        success: false,
        message: "",
        error: null,
    },

    reducers: {
        clearAppointment: (state) => {
            state.appointment = null;
            state.error = null;
            state.message = "";
        },

        clearAppointmentMessage: (state) => {
            state.success = false;
            state.message = "";
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.appointments =
                    action.payload.appointments || [];

                state.total = action.payload.total || 0;
                state.page = action.payload.page || 1;
                state.limit = action.payload.limit || 10;
                state.totalPages =
                    action.payload.totalPages || 0;

                state.message =
                    action.payload.message || "";

                state.error = null;
            })

            .addCase(getAppointments.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })

            .addCase(getAppointmentById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getAppointmentById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.appointment =
                    action.payload.appointment ||
                    action.payload;

                state.error = null;
            })

            .addCase(getAppointmentById.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })

            .addCase(createAppointment.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.message = "";
                state.error = null;
            })

            .addCase(createAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.message =
                    action.payload.message ||
                    "Rendez-vous créé avec succès";

                state.error = null;
            })

            .addCase(createAppointment.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = "";
                state.error = action.payload;
            })

            .addCase(updateAppointment.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.message = "";
                state.error = null;
            })

            .addCase(updateAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.appointment =
                    action.payload.appointment ||
                    action.payload;

                state.message =
                    action.payload.message ||
                    "Rendez-vous modifié avec succès";

                state.error = null;
            })

            .addCase(updateAppointment.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = "";
                state.error = action.payload;
            })

            .addCase(updateAppointmentStatus.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.message = "";
                state.error = null;
            })

            .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const updatedAppointment =
                    action.payload.appointment ||
                    action.payload;

                state.appointment = updatedAppointment;

                const appointmentId =
                    updatedAppointment.appointmentid;

                state.appointments = state.appointments.map(
                    (appointment) =>
                        appointment.appointmentid === appointmentId
                            ? {
                                  ...appointment,
                                  ...updatedAppointment,
                              }
                            : appointment
                );

                state.message =
                    action.payload.message ||
                    "Statut modifié avec succès";

                state.error = null;
            })

            .addCase(updateAppointmentStatus.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = "";
                state.error = action.payload;
            })

            .addCase(deleteAppointment.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.message = "";
                state.error = null;
            })

            .addCase(deleteAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.appointments =
                    state.appointments.filter(
                        (appointment) =>
                            appointment.appointmentid !==
                            action.payload.appointmentId
                    );

                state.total = Math.max(
                    0,
                    state.total - 1
                );

                state.message =
                    action.payload.message ||
                    "Rendez-vous supprimé avec succès";

                state.error = null;
            })

            .addCase(deleteAppointment.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = "";
                state.error = action.payload;
            });
    },
});

export const {
    clearAppointment,
    clearAppointmentMessage,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;