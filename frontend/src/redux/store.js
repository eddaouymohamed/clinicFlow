import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import dashboardReducer from "./dashboard/dashboardSlice";
import patientsReducer from "./patients/patientsSlice";
import appointmentsReducer from "./appointments/appointmentsSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        patients: patientsReducer,
        appointments: appointmentsReducer,
    },
});

export default store;