import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    FaThLarge, FaBook, FaUsers, FaPlus, FaSignOutAlt,
    FaChartBar, FaGraduationCap, FaWallet, FaBars, FaTimes, FaUserCheck
} from 'react-icons/fa';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    const menuItems = {
        instructor: [
            { path: '/instructor', icon: <FaThLarge />, label: 'Overview' },
            { path: '/instructor/courses', icon: <FaBook />, label: 'Curriculum' },
            { path: '/instructor/courses/create', icon: <FaPlus />, label: 'Create' },
            { path: '/instructor/students', icon: <FaUsers />, label: 'Submissions' },
            { path: '/instructor/payments', icon: <FaUserCheck />, label: 'Admissions' },
        ],
        admin: [
            { path: '/admin', icon: <FaThLarge />, label: 'Academy' },
            { path: '/admin/tenants', icon: <FaUsers />, label: 'Organizations' },
        ],
        student: [
            { path: '/', icon: <FaGraduationCap />, label: 'Haxo Marketplace' },
            { path: '/student/progress', icon: <FaChartBar />, label: 'My Learning' },
        ]
    };

    const currentMenu = menuItems[user?.role] || [];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-50/50 selection:bg-indigo-100 selection:text-indigo-900 relative">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 text-white transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
                <div className="flex flex-col h-full p-8">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                            <FaGraduationCap size={24} />
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase">HaxoAcademy</span>
                    </div>

                    <nav className="flex-grow space-y-2">
                        {currentMenu.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-semibold transition-all ${location.pathname === item.path
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {item.icon}
                                <span className="tracking-tight">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="pt-8 border-t border-white/5">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl font-semibold text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-95"
                        >
                            <FaSignOutAlt />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
                    <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                        <FaBars className="text-gray-900" />
                    </button>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end">
                            <div className="font-bold text-gray-900 leading-none">{user?.name}</div>
                            <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] mt-1">Haxo {user?.role}</div>
                        </div>
                        <div className="relative group">
                            <img
                                src={`https://i.pravatar.cc/150?u=${user?._id}`}
                                className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-100 group-hover:ring-indigo-600 transition-all"
                                alt="Profile"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                    </div>
                </header>
                <main className="flex-grow">
                    <div className="animate-fade-up">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
