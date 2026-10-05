import { useEffect, useState } from "react";

const PatientForm = ({ patient, onSubmit, onCancel, loading }) => {
    const [formData, setFormData] = useState({
        fullname: "",
        cin: "",
        birthdate: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        if (patient) {
            setFormData({
                fullname: patient.fullname || "",
                cin: patient.cin || "",
                birthdate: patient.birthdate
                    ? String(patient.birthdate).slice(0, 10)
                    : "",
                phone: patient.phone || "",
                address: patient.address || "",
            });
        } else {
            setFormData({
                fullname: "",
                cin: "",
                birthdate: "",
                phone: "",
                address: "",
            });
        }
    }, [patient]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Nom complet
                </label>

                <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    CIN
                </label>

                <input
                    type="text"
                    name="cin"
                    value={formData.cin}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Date de naissance
                </label>

                <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Téléphone
                </label>

                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Adresse
                </label>

                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "Enregistrement..."
                        : patient
                            ? "Modifier"
                            : "Ajouter"}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-slate-200 bg-white px-5 py-3 font-medium text-slate-600 hover:bg-slate-50"
                    >
                        Annuler
                    </button>
                )}
            </div>
        </form>
    );
};

export default PatientForm;