import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getDashboardStats } from "../redux/dashboard/dashboardSlice";

const Dashboard = () => {
    const dispatch = useDispatch();

    const {
        totalPatients,
        todayAppointments,
        pendingAppointments,
        confirmedAppointments,
        loading,
        error,
    } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(getDashboardStats());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-slate-500">
                    Chargement...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-100 text-red-500 rounded-lg p-4">
                {error}
            </div>
        );
    }

    const stats = [
        {
            title: "Total patients",
            value: totalPatients,
        },
        {
            title: "Rendez-vous du jour",
            value: todayAppointments,
        },
        {
            title: "Pending",
            value: pendingAppointments,
        },
        {
            title: "Confirmed",
            value: confirmedAppointments,
        },
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-slate-700">
                    Dashboard
                </h1>

                <p className="text-slate-500 mt-1">
                    Vue générale de la clinique
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
                    >
                        <p className="text-sm text-slate-500">
                            {stat.title}
                        </p>

                        <p className="text-3xl font-bold text-slate-700 mt-3">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;