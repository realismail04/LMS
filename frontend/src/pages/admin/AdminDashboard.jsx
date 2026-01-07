import { useState, useEffect } from 'react';
import { FaUsers, FaGraduationCap, FaBook, FaTrash, FaChartLine, FaBuilding, FaShieldAlt, FaChartBar, FaPlus, FaCheckCircle, FaGlobe, FaPalette } from 'react-icons/fa';
import { StatCard } from '../../components/DashboardWidgets';
import api from '../../utils/api';
import usePageTitle from '../../hooks/usePageTitle';

const AdminDashboard = () => {
    usePageTitle('Admin Central');
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalEnrollments: 0,
        totalTenants: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tenantRes, userRes, courseRes] = await Promise.all([
                api.get('/tenants'),
                api.get('/users/admin/all'), // Assuming this exists or building it
                api.get('/courses')
            ]);

            setTenants(tenantRes.data);
            setStats({
                totalUsers: userRes.data?.length || 0,
                totalCourses: courseRes.data?.length || 0,
                totalEnrollments: 0, // Would need aggregate
                totalTenants: tenantRes.data?.length || 0
            });
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTenant = async (id) => {
        if (!window.confirm("Are you sure? This will delete the entire organization!")) return;
        try {
            await api.delete(`/tenants/${id}`);
            setTenants(tenants.filter(t => t._id !== id));
        } catch (error) {
            alert("Failed to delete tenant");
        }
    };

    return (
        <div className="space-y-10 pb-20 animate-fade-in">
            {/* Admin Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center">
                        <FaShieldAlt className="mr-3 text-red-600" /> Admin Central
                    </h1>
                    <p className="text-gray-500 mt-1">Platform-wide oversight and organization management.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold flex items-center shadow-lg hover:bg-black transition-all">
                        <FaChartBar className="mr-2" /> Global Reports
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers} icon={<FaUsers />} color="bg-blue-500" />
                <StatCard title="Total Courses" value={stats.totalCourses} icon={<FaBook />} color="bg-indigo-500" />
                <StatCard title="Active Tenants" value={stats.totalTenants} icon={<FaBuilding />} color="bg-purple-500" />
                <StatCard title="Platform Health" value="99.9%" icon={<FaCheckCircle />} color="bg-green-500" />
            </div>

            {/* Tenant Management */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <h2 className="text-xl font-black text-gray-900 flex items-center">
                        <FaBuilding className="mr-3 text-indigo-600" /> Organization Management
                    </h2>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center hover:bg-indigo-700 transition-all">
                        <FaPlus className="mr-2" /> Provision New Tenant
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50/50">
                            <tr>
                                <th className="px-8 py-4">Organization</th>
                                <th className="px-8 py-4">Domain/Subdomain</th>
                                <th className="px-8 py-4">Branding</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-medium">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-gray-400">Loading organizations...</p>
                                    </td>
                                </tr>
                            ) : tenants.map((tenant) => (
                                <tr key={tenant._id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                                                {tenant.name.charAt(0)}
                                            </div>
                                            <p className="font-bold text-gray-900">{tenant.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <FaGlobe className="mr-2 opacity-30" /> {tenant.domain || tenant.subdomain + '.lms.com'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex space-x-1">
                                            <div className="w-4 h-4 rounded-full border border-gray-100 shadow-sm" style={{ backgroundColor: tenant.branding?.primaryColor || '#4f46e5' }} />
                                            <div className="w-4 h-4 rounded-full border border-gray-100 shadow-sm" style={{ backgroundColor: tenant.branding?.secondaryColor || '#1f2937' }} />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest border border-green-100">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => handleDeleteTenant(tenant._id)}
                                            className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
