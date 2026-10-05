import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    createAppointment,
    deleteAppointment,
    getAppointments,
    updateAppointment,
} from "../redux/appointments/appointmentsSlice";

import AppointmentForm from "../components/AppointmentForm";

const Appointments = () => {
    const dispatch = useDispatch();

    const {
        appointments,
        page,
        limit,
        totalPages,
        loading,
        message,
        error,
    } = useSelector(
        (state) => state.appointments
    );

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedAppointment, setSelectedAppointment] =
        useState(null);

    useEffect(() => {
        dispatch(
            getAppointments({
                search,
                status,
                page,
                limit,
            })
        );
    }, [
        dispatch,
        search,
        status,
        page,
        limit,
    ]);

    const refreshAppointments = (
        currentPage = page
    ) => {
        dispatch(
            getAppointments({
                search,
                status,
                page: currentPage,
                limit,
            })
        );
    };

    const handleAdd = () => {
        setSelectedAppointment(null);
        setShowForm(true);
    };

    const handleEdit = (appointment) => {
        setSelectedAppointment(appointment);
        setShowForm(true);
    };

    const handleCancel = () => {
        setSelectedAppointment(null);
        setShowForm(false);
    };

    const handleSubmit = async (formData) => {
        let result;

        if (selectedAppointment) {
            result = await dispatch(
                updateAppointment({
                    appointmentId:
                        selectedAppointment.appointmentid,
                    appointmentData: formData,
                })
            );
        } else {
            result = await dispatch(
                createAppointment(formData)
            );
        }

        if (
            createAppointment.fulfilled.match(result) ||
            updateAppointment.fulfilled.match(result)
        ) {
            setSelectedAppointment(null);
            setShowForm(false);
            refreshAppointments();
        }
    };

    const handleDelete = async (appointmentId) => {
        const confirmed = window.confirm(
            "Voulez-vous supprimer ce rendez-vous ?"
        );

        if (!confirmed) {
            return;
        }

        const result = await dispatch(
            deleteAppointment(appointmentId)
        );

        if (deleteAppointment.fulfilled.match(result)) {
            refreshAppointments();
        }
    };

    const handlePrevious = () => {
        if (page > 1) {
            refreshAppointments(page - 1);
        }
    };

    const handleNext = () => {
        if (page < totalPages) {
            refreshAppointments(page + 1);
        }
    };

    return (
        <div>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-700">
                        Rendez-vous
                    </h1>

                    <p className="mt-1 text-slate-500">
                        Gestion des rendez-vous
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAdd}
                    className="rounded-lg bg-blue-500 px-5 py-3 font-medium text-white hover:bg-blue-600"
                >
                    Nouveau rendez-vous
                </button>
            </div>

            {message && (
                <div className="mb-4 rounded-lg border border-green-100 bg-green-50 p-4 text-green-600">
                    {message}
                </div>
            )}

            {error && (
                <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-4 text-red-500">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-lg font-semibold text-slate-700">
                        {selectedAppointment
                            ? "Modifier le rendez-vous"
                            : "Nouveau rendez-vous"}
                    </h2>

                    <AppointmentForm
                        appointment={selectedAppointment}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        loading={loading}
                    />
                </div>
            )}

            <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Rechercher un motif ou un patient..."
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />

                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                    <option value="">
                        Tous les statuts
                    </option>

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

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Date
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Patient
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Motif
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Statut
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {!loading &&
                                appointments.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-10 text-center text-slate-500"
                                        >
                                            Aucun rendez-vous trouvé.
                                        </td>
                                    </tr>
                                )}

                            {appointments.map(
                                (appointment) => (
                                    <tr
                                        key={
                                            appointment.appointmentid
                                        }
                                        className="border-t border-slate-100"
                                    >
                                        <td className="px-6 py-4 text-slate-700">
                                            {new Date(
                                                appointment.appointmentdate
                                            ).toLocaleString(
                                                "fr-FR"
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {appointment.patientid}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {appointment.reason}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                                                {
                                                    appointment.status
                                                }
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            appointment
                                                        )
                                                    }
                                                    className="text-sm font-medium text-slate-600 hover:text-slate-800"
                                                >
                                                    Modifier
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            appointment.appointmentid
                                                        )
                                                    }
                                                    className="text-sm font-medium text-red-500 hover:text-red-600"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="border-t border-slate-100 p-6 text-center text-slate-500">
                        Chargement des rendez-vous...
                    </div>
                )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
                <button
                    type="button"
                    disabled={page <= 1 || loading}
                    onClick={handlePrevious}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Précédent
                </button>

                <span className="text-sm text-slate-500">
                    Page {page}
                    {totalPages > 0 &&
                        ` / ${totalPages}`}
                </span>

                <button
                    type="button"
                    disabled={
                        page >= totalPages ||
                        totalPages === 0 ||
                        loading
                    }
                    onClick={handleNext}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
};

export default Appointments;