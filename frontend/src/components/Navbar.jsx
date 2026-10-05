import { useSelector } from "react-redux";

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
            <div>
                <h1 className="text-lg font-semibold text-slate-700">
                    ClinicFlow
                </h1>
            </div>

            <div className="text-right">
                <p className="text-sm font-medium text-slate-700">
                    {user?.fullName}
                </p>

                <p className="text-xs text-slate-500">
                    {user?.role}
                </p>
            </div>
        </header>
    );
};

export default Navbar;