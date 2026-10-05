import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    clearPatient,
    getPatientById,
} from "../redux/patients/patientsSlice";

import api from "../services/api";

const PatientDetails = () => {
    const { patientId } = useParams();
    const dispatch = useDispatch();

    const { patient, loading, error } = useSelector(
        (state) => state.patients
    );

    const [appointments, setAppointments] = useState([]);
    const [appointmentsLoading, setAppointmentsLoading] = useState(false);
    const [appointmentsError, setAppointmentsError] = useState(null);

    useEffect(() => {
        dispatch(getPatientById(patientId));

        return () => {
            dispatch(clearPatient());
        };
    }, [dispatch, patientId]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setAppointmentsLoading(true);
                setAppointmentsError(null);

                const response = await api.get("/appointments", {
                    params: {
                        search: patientId,
                        page: 1,
                        limit: 100,
                    },
                });

                setAppointments(response.data.appointments || []);
            } catch (error) {
                setAppointmentsError(
                    error.response?.data?.message ||
                    "Erreur lors du chargement des rendez-vous"
                );
            } finally {
                setAppointmentsLoading(false);
            }
        };

        fetchAppointments();
    }, [patientId]);

    if (loading) {
        return (
            <div className="py-20 text-center text-slate-500">
                Chargement du patient...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-red-500">
                {error}
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="py-20 text-center text-slate-500">
                Patient introuvable.
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-700">
                        Détails du patient
                    </h1>

                    <p className="mt-1 text-slate-500">
                        Informations et rendez-vous
                    </p>
                </div>

                <Link
                    to="/patients"
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                    Retour
                </Link>
            </div>

            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold text-slate-700">
                    Informations du patient
                </h2>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-slate-500">
                            Nom complet
                        </p>

                        <p className="mt-1 font-medium text-slate-700">
                            {patient.fullname}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">
                            CIN
                        </p>

                        <p className="mt-1 font-medium text-slate-700">
                            {patient.cin}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">
                            Date de naissance
                        </p>

                        <p className="mt-1 font-medium text-slate-700">
                            {patient.birthdate
                                ? String(patient.birthdate).slice(0, 10)
                                : "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">
                            Téléphone
                        </p>

                        <p className="mt-1 font-medium text-slate-700">
                            {patient.phone}
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <p className="text-sm text-slate-500">
                            Adresse
                        </p>

                        <p className="mt-1 font-medium text-slate-700">
                            {patient.address || "-"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-6">
                    <h2 className="text-lg font-semibold text-slate-700">
                        Rendez-vous du patient
                    </h2>
                </div>

                {appointmentsLoading && (
                    <div className="p-6 text-slate-500">
                        Chargement des rendez-vous...
                    </div>
                )}

                {appointmentsError && (
                    <div className="m-6 rounded-lg border border-red-100 bg-red-50 p-4 text-red-500">
                        {appointmentsError}
                    </div>
                )}

                {!appointmentsLoading &&
                    !appointmentsError &&
                    appointments.length === 0 && (
                        <div className="p-6 text-slate-500">
                            Aucun rendez-vous trouvé.
                        </div>
                    )}

                {!appointmentsLoading &&
                    !appointmentsError &&
                    appointments.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                            Date
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                            Motif
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                            Statut
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {appointments.map((appointment) => (
                                        <tr
                                            key={appointment.appointmentid}
                                            className="border-t border-slate-100"
                                        >
                                            <td className="px-6 py-4 text-slate-700">
                                                {new Date(
                                                    appointment.appointmentdate
                                                ).toLocaleString("fr-FR")}
                                            </td>

                                            <td className="px-6 py-4 text-slate-600">
                                                {appointment.reason}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                                                    {appointment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default PatientDetails;