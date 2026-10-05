import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const links = [
        {
            name: "Dashboard",
            path: "/dashboard",
        },
        {
            name: "Patients",
            path: "/patients",
        },
        {
            name: "Rendez-vous",
            path: "/appointments",
        },
    ];

    return (
        <aside className="w-64 min-h-screen bg-white border-r border-slate-200 p-5">
            <h2 className="text-xl font-bold text-blue-500 mb-8">
                ClinicFlow
            </h2>

            <nav className="space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg transition ${isActive
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-slate-600 hover:bg-slate-50"
                            }`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;