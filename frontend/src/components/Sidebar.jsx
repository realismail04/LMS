import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { FaHome, FaBook, FaChalkboardTeacher, FaCog, FaSignOutAlt, FaUserGraduate, FaChartLine } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { user, logout } = useAuth();
    const { tenant } = useCourse();
    const location = useLocation();

    const role = user?.role || 'student'; // Fallback for dev/mock

    const studentLinks = [
        { name: 'Dashboard', path: '/', icon: FaHome },
        { name: 'My Courses', path: '/courses', icon: FaBook },
        { name: 'Progress', path: '/progress', icon: FaChartLine },
    ];

    const instructorLinks = [
        { name: 'Dashboard', path: '/instructor', icon: FaHome },
        { name: 'Course Manager', path: '/instructor/courses', icon: FaChalkboardTeacher },
        { name: 'Students', path: '/instructor/students', icon: FaUserGraduate },
    ];

    const links = role === 'instructor' ? instructorLinks : studentLinks;

    const isActive = (path) => location.pathname === path;

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto shadow-2xl`}
        >
            {/* Logo Area */}
            <div className="flex items-center justify-center h-20 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                    {tenant?.name || 'LMS Pro'}
                </h1>
            </div>

            {/* User Profile Summary */}
            <div className="p-6 border-b border-slate-800 bg-slate-800/30">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <p className="text-sm font-semibold truncate w-32">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-400 capitalize">{role}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="mt-6 px-4 space-y-2">
                {links.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive(link.path)
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <link.icon className={`mr-3 h-5 w-5 transition-colors duration-200 ${isActive(link.path) ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                        {link.name}
                    </Link>
                ))}
            </nav>

            {/* Bottom Links */}
            <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900">
                <button
                    onClick={logout}
                    className="flex w-full items-center px-4 py-3 text-sm font-medium text-slate-400 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
                >
                    <FaSignOutAlt className="mr-3 h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
