import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
    createPatient,
    deletePatient,
    getPatients,
    updatePatient,
} from "../redux/patients/patientsSlice";

import PatientForm from "../components/PatientForm";

const Patients = () => {
    const dispatch = useDispatch();

    const {
        patients,
        page,
        limit,
        hasNextPage,
        loading,
        success,
        message,
        error,
    } = useSelector((state) => state.patients);

    const { user } = useSelector((state) => state.auth);

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        dispatch(
            getPatients({
                search,
                page,
                limit,
            })
        );
    }, [dispatch, page, limit, search]);

    const handleAdd = () => {
        setSelectedPatient(null);
        setShowForm(true);
    };

    const handleEdit = (patient) => {
        setSelectedPatient(patient);
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setSelectedPatient(null);
    };

    const handleSubmit = async (formData) => {
        let result;

        if (selectedPatient) {
            result = await dispatch(
                updatePatient({
                    patientId: selectedPatient.patientid,
                    patientData: formData,
                })
            );
        } else {
            result = await dispatch(
                createPatient(formData)
            );
        }

        if (
            createPatient.fulfilled.match(result) ||
            updatePatient.fulfilled.match(result)
        ) {
            setShowForm(false);
            setSelectedPatient(null);

            dispatch(
                getPatients({
                    search,
                    page: 1,
                    limit,
                })
            );
        }
    };

    const handleDelete = async (patientId) => {
        const confirmed = window.confirm(
            "Voulez-vous supprimer ce patient ?"
        );

        if (!confirmed) {
            return;
        }

        const result = await dispatch(
            deletePatient(patientId)
        );

        if (deletePatient.fulfilled.match(result)) {
            dispatch(
                getPatients({
                    search,
                    page,
                    limit,
                })
            );
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);

        if (page !== 1) {
            dispatch(
                getPatients({
                    search: e.target.value,
                    page: 1,
                    limit,
                })
            );
        }
    };

    const handlePrevious = () => {
        if (page > 1) {
            dispatch(
                getPatients({
                    search,
                    page: page - 1,
                    limit,
                })
            );
        }
    };

    const handleNext = () => {
        if (hasNextPage) {
            dispatch(
                getPatients({
                    search,
                    page: page + 1,
                    limit,
                })
            );
        }
    };

    return (
        <div>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-700">
                        Patients
                    </h1>

                    <p className="mt-1 text-slate-500">
                        Gestion des patients
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAdd}
                    className="rounded-lg bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-600"
                >
                    Ajouter un patient
                </button>
            </div>

            {success && message && (
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
                        {selectedPatient
                            ? "Modifier le patient"
                            : "Ajouter un patient"}
                    </h2>

                    <PatientForm
                        patient={selectedPatient}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        loading={loading}
                    />
                </div>
            )}

            <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Rechercher par nom ou CIN..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Nom complet
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    CIN
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Téléphone
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Date de naissance
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {!loading && patients.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-10 text-center text-slate-500"
                                    >
                                        Aucun patient trouvé.
                                    </td>
                                </tr>
                            )}

                            {patients.map((patient) => (
                                <tr
                                    key={patient.patientid}
                                    className="border-t border-slate-100"
                                >
                                    <td className="px-6 py-4 text-slate-700">
                                        {patient.fullname}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {patient.cin}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {patient.phone}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {patient.birthdate
                                            ? String(
                                                patient.birthdate
                                            ).slice(0, 10)
                                            : "-"}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-3">
                                            <Link
                                                to={`/patients/${patient.patientid}`}
                                                className="text-sm font-medium text-blue-500 hover:text-blue-600"
                                            >
                                                Voir
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(patient)
                                                }
                                                className="text-sm font-medium text-slate-600 hover:text-slate-800"
                                            >
                                                Modifier
                                            </button>

                                            {user?.role === "admin" && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            patient.patientid
                                                        )
                                                    }
                                                    className="text-sm font-medium text-red-500 hover:text-red-600"
                                                >
                                                    Supprimer
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="border-t border-slate-100 p-6 text-center text-slate-500">
                        Chargement des patients...
                    </div>
                )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
                <button
                    type="button"
                    disabled={page === 1 || loading}
                    onClick={handlePrevious}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Précédent
                </button>

                <span className="text-sm text-slate-500">
                    Page {page}
                </span>

                <button
                    type="button"
                    disabled={!hasNextPage || loading}
                    onClick={handleNext}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
};

export default Patients;