import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getPatients } from "../redux/patients/patientsSlice";

const AppointmentForm = ({
    appointment,
    onSubmit,
    onCancel,
    loading,
}) => {
    const dispatch = useDispatch();

    const { patients } = useSelector(
        (state) => state.patients
    );

    const [formData, setFormData] = useState({
        patientid: "",
        appointmentdate: "",
        reason: "",
        status: "pending",
    });

    useEffect(() => {
        dispatch(
            getPatients({
                page: 1,
                limit: 100,
                search: "",
            })
        );
    }, [dispatch]);

    useEffect(() => {
        if (appointment) {
            setFormData({
                patientid: appointment.patientid || "",
                appointmentdate: appointment.appointmentdate
                    ? new Date(appointment.appointmentdate)
                        .toISOString()
                        .slice(0, 16)
                    : "",
                reason: appointment.reason || "",
                status: appointment.status || "pending",
            });
        } else {
            setFormData({
                patientid: "",
                appointmentdate: "",
                reason: "",
                status: "pending",
            });
        }
    }, [appointment]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit({
            ...formData,
            appointmentdate: new Date(
                formData.appointmentdate
            ).toISOString(),
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Patient
                </label>

                <select
                    name="patientid"
                    value={formData.patientid}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                    <option value="">
                        Sélectionner un patient
                    </option>

                    {patients.map((patient) => (
                        <option
                            key={patient.patientid}
                            value={patient.patientid}
                        >
                            {patient.fullname} - {patient.cin}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Date et heure
                </label>

                <input
                    type="datetime-local"
                    name="appointmentdate"
                    value={formData.appointmentdate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Motif
                </label>

                <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Statut
                </label>

                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                    <option value="pending">
                        Pending
                    </option>

                    <option value="confirmed">
                        Confirmed
                    </option>

                    <option value="cancelled">
                        Cancelled
                    </option>
                </select>
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "Enregistrement..."
                        : appointment
                            ? "Modifier"
                            : "Créer"}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border border-slate-200 bg-white px-5 py-3 font-medium text-slate-600 hover:bg-slate-50"
                >
                    Annuler
                </button>
            </div>
        </form>
    );
};

export default AppointmentForm;