import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const login = createAsyncThunk(
    "auth/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Erreur de connexion"
            );
        }
    }
);

export const getMe = createAsyncThunk(
    "auth/getMe",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/auth/me");

            return response.data;
        } catch (error) {
            localStorage.removeItem("token");

            return rejectWithValue(
                error.response?.data?.message || "Session invalide"
            );
        }
    }
);

const authSlice = createSlice({
    name: "auth",

    initialState: {
        user: null,
        token: localStorage.getItem("token"),
        loading: false,
        success: false,
        message: "",
        error: null,
    },

    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.loading = false;
            state.success = false;
            state.message = "";
            state.error = null;

            localStorage.removeItem("token");
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.message = "";
                state.error = null;
            })

            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.message =
                    action.payload.message || "Connexion réussie";
                state.error = null;
            })

            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = "";
                state.error = action.payload;
            })

            .addCase(getMe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getMe.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.success = true;
            })

            .addCase(getMe.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;