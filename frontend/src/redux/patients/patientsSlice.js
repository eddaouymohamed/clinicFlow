import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const getPatients = createAsyncThunk(
    "patients/getPatients",
    async (
        { search = "", page = 1, limit = 10 } = {},
        { rejectWithValue }
    ) => {
        try {
            const response = await api.get("/patients", {
                params: {
                    search,
                    page,
                    limit,
                },
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Erreur lors du chargement des patients"
            );
        }
    }
);

export const getPatientById = createAsyncThunk(
    "patients/getPatientById",
    async (patientId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/patients/${patientId}`);

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Erreur lors du chargement du patient"
            );
        }
    }
);

export const createPatient = createAsyncThunk(
    "patients/createPatient",
    async (patientData, { rejectWithValue }) => {
        try {
            const response = await api.post("/patients", patientData);

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Erreur lors de la création du patient"
            );
        }
    }
);

export const updatePatient = createAsyncThunk(
    "patients/updatePatient",
    async (
        { patientId, patientData },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.put(
                `/patients/${patientId}`,
                patientData
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Erreur lors de la modification du patient"
            );
        }
    }
);

export const deletePatient = createAsyncThunk(
    "patients/deletePatient",
    async (patientId, { rejectWithValue }) => {
        try {
            const response = await api.delete(
                `/patients/${patientId}`
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Erreur lors de la suppression du patient"
            );
        }
    }
);

const patientsSlice = createSlice({
    name: "patients",

    initialState: {
        patients: [],
        patient: null,
        page: 1,
        limit: 10,
        hasNextPage: false,
        loading: false,
        success: false,
        message: "",
        error: null,
    },

    reducers: {
        clearPatient: (state) => {
            state.patient = null;
            state.error = null;
        },

        clearPatientMessage: (state) => {
            state.success = false;
            state.message = "";
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(getPatients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getPatients.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.patients = action.payload.patients || [];
                state.page = action.payload.page || 1;
                state.limit = action.payload.limit || 10;

                state.hasNextPage =
                    (action.payload.patients || []).length ===
                    (action.payload.limit || 10);

                state.error = null;
            })

            .addCase(getPatients.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })

            .addCase(getPatientById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getPatientById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.patient =
                    action.payload.patient || action.payload;
                state.error = null;
            })

            .addCase(getPatientById.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })

            .addCase(createPatient.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.message = "";
                state.error = null;
            })

            .addCase(createPatient.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message =
                    action.payload.message ||
                    "Patient créé avec succès";
                state.error = null;
            })

            .addCase(createPatient.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = "";
                state.error = action.payload;
            })

            .addCase(updatePatient.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.message = "";
                state.error = null;
            })

            .addCase(updatePatient.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.patient =
                    action.payload.patient || action.payload;
                state.message =
                    action.payload.message ||
                    "Patient modifié avec succès";
                state.error = null;
            })

            .addCase(updatePatient.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = "";
                state.error = action.payload;
            })

            .addCase(deletePatient.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.message = "";
                state.error = null;
            })

            .addCase(deletePatient.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message =
                    action.payload.message ||
                    "Patient supprimé avec succès";
                state.error = null;
            })

            .addCase(deletePatient.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = "";
                state.error = action.payload;
            });
    },
});

export const {
    clearPatient,
    clearPatientMessage,
} = patientsSlice.actions;

export default patientsSlice.reducer;