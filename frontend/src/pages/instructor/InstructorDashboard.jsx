import { useState, useEffect } from 'react';
import { FaUsers, FaDollarSign, FaChalkboardTeacher, FaStar, FaPlus, FaBook, FaUserCheck } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';
import AnalyticsChart from '../../components/AnalyticsChart';
import usePageTitle from '../../hooks/usePageTitle';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const InstructorDashboard = () => {
    usePageTitle('HaxoAcademy Dashboard');
    const { user } = useAuth();
    const { courses } = useCourse();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [pendingAdmissions, setPendingAdmissions] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [analyticsRes, paymentsRes] = await Promise.all([
                    api.get('/analytics/instructor'),
                    api.get('/courses/instructor/payments')
                ]);
                setAnalytics(analyticsRes.data);
                setPendingAdmissions(paymentsRes.data.length);
            } catch (error) {
                console.error("Dashboard fetch error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const stats = [
        { label: 'Platform Revenue', value: `$${analytics?.revenue || 0}`, icon: <FaDollarSign />, color: 'bg-green-500', trend: '+12.4%' },
        { label: 'Total Students', value: analytics?.totalStudents || 0, icon: <FaUsers />, color: 'bg-indigo-500', trend: '+5.2%' },
        { label: 'Active Curriculums', value: courses.length, icon: <FaBook />, color: 'bg-purple-500', trend: 'Healthy' },
        { label: 'Pending Admissions', value: pendingAdmissions, icon: <FaUserCheck />, color: 'bg-orange-600', trend: 'Waitlisted', link: '/instructor/payments' },
    ];

    if (loading) return (
        <div className="p-20 text-center animate-pulse">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-8 shadow-lg shadow-indigo-600/20" />
            <p className="font-bold text-gray-400 uppercase tracking-[0.3em] text-[10px]">HaxoTech Systems Synchronizing...</p>
        </div>
    );

    return (
        <div className="p-10 space-y-12 pb-32 animate-fade-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tighter uppercase italic">Control Center</h1>
                    <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-xs">Principal: {user?.name} | Academy HQ</p>
                </div>
                <button
                    onClick={() => navigate('/instructor/courses/create')}
                    className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-bold hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30 flex items-center gap-3 active:scale-95 uppercase italic tracking-tight"
                >
                    <FaPlus /> Launch Curriculum
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        onClick={() => stat.link && navigate(stat.link)}
                        className={`bg-white p-10 rounded-[48px] border border-gray-100 shadow-3xl shadow-gray-200/50 group transition-all duration-500 ${stat.link ? 'cursor-pointer hover:-translate-y-3 ring-2 ring-transparent hover:ring-indigo-600/10' : ''}`}
                    >
                        <div className="flex justify-between items-start mb-10">
                            <div className={`w-16 h-16 ${stat.color} text-white rounded-3xl flex items-center justify-center shadow-2xl`}>
                                {stat.icon}
                            </div>
                            <span className={`text-[10px] font-bold px-4 py-2 rounded-full ${stat.trend.includes('+') ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'} uppercase tracking-[0.1em]`}>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">{stat.label}</h3>
                        <p className="text-4xl font-extrabold text-gray-900 tracking-tighter uppercase italic">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-white p-12 rounded-[60px] shadow-3xl shadow-gray-200/50 border border-gray-100 group">
                    <div className="flex justify-between items-center mb-12">
                        <h3 className="text-3xl font-extrabold text-gray-900 tracking-tighter uppercase italic">Growth Metrics</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400">
                                <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Views
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Graduations
                            </div>
                        </div>
                    </div>
                    <div className="h-96">
                        <AnalyticsChart
                            data={analytics?.trends || []}
                            type="line"
                            dataKeys={['views', 'completions']}
                            colors={['#6366f1', '#10b981']}
                        />
                    </div>
                </div>

                <div className="bg-gray-950 p-12 rounded-[60px] shadow-4xl text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-indigo-600/30 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
                    <h3 className="text-3xl font-extrabold mb-12 tracking-tighter uppercase italic relative z-10">System Vitals</h3>
                    <div className="space-y-12 relative z-10">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-2">
                                <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Mastery Index</span>
                                <span className="font-bold text-indigo-400 text-sm tracking-widest italic">88.4%</span>
                            </div>
                            <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-1">
                                <div className="bg-indigo-600 h-full w-[88%] rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)]" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-2">
                                <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Course Velocity</span>
                                <span className="font-bold text-green-400 text-sm tracking-widest italic">62.1%</span>
                            </div>
                            <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-1">
                                <div className="bg-green-500 h-full w-[62%] rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-2">
                                <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Haxo Score</span>
                                <span className="font-bold text-yellow-500 text-sm tracking-widest italic">4.96/5.0</span>
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => <FaStar key={i} className="text-yellow-500" />)}
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 p-8 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-sm group-hover:bg-white/10 transition-all duration-500">
                        <p className="text-xs font-semibold text-gray-400 mb-6 leading-relaxed">System Intelligence suggests you are in the top 3% of global academy mentors this month. 🥋</p>
                        <button className="w-full py-4 bg-white text-gray-950 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all transform active:scale-95 shadow-2xl shadow-white/5">Export Intelligence</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;
