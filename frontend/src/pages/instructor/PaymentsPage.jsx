import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FaCheck, FaTimes, FaUserCheck, FaUser, FaBook, FaCalendarAlt, FaSearch, FaFilter, FaFingerprint } from 'react-icons/fa';

const PaymentsPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/courses/instructor/payments');
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id, status) => {
        const action = status === 'completed' ? 'APPROVE ADMISSION' : 'REJECT APPLICATION';
        if (!window.confirm(`Are you sure you want to ${action} for this student?`)) return;
        try {
            await api.put(`/courses/payment/${id}/verify`, { status });
            setOrders(orders.filter(o => o._id !== id));
            // In sleek UI, we avoid alert() if possible, but keeping it for functional feedback
        } catch (error) {
            alert("Administrative verification failed");
        }
    };

    const filteredOrders = orders.filter(order =>
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.transactionId.includes(searchTerm)
    );

    if (loading) return (
        <div className="p-20 text-center animate-pulse">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-8 shadow-lg shadow-indigo-600/20" />
            <p className="font-bold text-gray-400 uppercase tracking-[0.3em] text-[10px]">Accessing Admission Database...</p>
        </div>
    );

    return (
        <div className="p-10 max-w-7xl mx-auto animate-fade-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                <div>
                    <h1 className="text-5xl font-extrabold tracking-tighter text-gray-900 mb-2 uppercase italic">Admission Portal</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Verify student identity and curriculum access requests.</p>
                </div>
                <div className="bg-gray-900 px-8 py-5 rounded-[32px] text-white flex items-center gap-6 shadow-4xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-indigo-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/10">
                        <FaUserCheck size={24} />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500 mb-1">Pending Seats</div>
                        <div className="text-3xl font-extrabold tracking-tighter italic">{orders.length} <span className="text-xs text-indigo-400 not-italic ml-1">Students</span></div>
                    </div>
                </div>
            </div>

            {/* Premium Controls */}
            <div className="bg-white rounded-[40px] p-8 mb-12 shadow-3xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative group">
                    <FaSearch className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Admission ID, Student Name, or Curriculum Path..."
                        className="w-full pl-16 pr-8 py-5 rounded-[24px] bg-gray-50 border-2 border-transparent font-bold outline-none focus:border-indigo-600/20 focus:bg-white transition-all text-gray-900 placeholder:text-gray-300 tracking-tight"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="px-10 py-5 bg-gray-50 text-gray-400 rounded-[24px] font-bold uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-gray-900 hover:text-white transition-all active:scale-95 border border-gray-100">
                    <FaFilter /> Database Filter
                </button>
            </div>

            {/* Admission Queue */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-[60px] p-32 text-center border-4 border-dashed border-gray-50">
                    <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-inner">
                        <FaFingerprint size={48} />
                    </div>
                    <h3 className="text-3xl font-extrabold text-gray-300 uppercase italic tracking-tighter">Admission Queue Empty</h3>
                    <p className="text-gray-400 font-bold mt-4 uppercase tracking-widest text-[10px]">Monitoring global incoming enrollment requests...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {filteredOrders.map((order, idx) => (
                        <div key={order._id} className="bg-white rounded-[48px] p-10 shadow-3xl shadow-gray-200/50 border border-gray-100 flex flex-col lg:flex-row items-center gap-12 group hover:border-indigo-600/20 transition-all duration-500 animate-fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="flex-1 space-y-8 w-full">
                                <div className="flex flex-wrap gap-4">
                                    <span className="px-5 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3">
                                        <FaCalendarAlt size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="px-5 py-2 bg-gray-900 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] italic">
                                        {order.paymentMethod} Flow
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-[24px] bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-indigo-600/30">
                                            <FaUser size={24} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-1 leading-none">Applicant</div>
                                            <div className="text-xl font-extrabold text-gray-900 tracking-tight">{order.user.name}</div>
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{order.user.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-[24px] bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-purple-600/30">
                                            <FaBook size={24} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-1 leading-none">Curriculum Target</div>
                                            <div className="text-xl font-extrabold text-gray-900 tracking-tight uppercase italic">{order.course.title}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100/50 group-hover:bg-indigo-50/10 transition-colors">
                                    <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-gray-400 mb-4 ml-2">Verification Artifact</div>
                                    <div className="font-mono bg-white px-6 py-4 rounded-2xl text-indigo-600 font-bold border border-gray-100 break-all text-sm tracking-widest shadow-sm">
                                        {order.transactionId}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row lg:flex-col gap-6 w-full lg:w-fit border-t lg:border-t-0 lg:border-l border-gray-100 pt-10 lg:pt-0 lg:pl-12">
                                <div className="mb-0 text-left lg:text-right flex-1 lg:flex-none">
                                    <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-2 leading-none">Contribution</div>
                                    <div className="text-5xl font-extrabold text-gray-900 tracking-tighter italic uppercase">${order.amount}</div>
                                </div>
                                <div className="flex flex-col gap-3 w-full lg:w-48">
                                    <button
                                        onClick={() => handleVerify(order._id, 'completed')}
                                        className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-bold shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 flex items-center justify-center gap-3 transition-all active:scale-95 uppercase italic text-sm tracking-tight"
                                    >
                                        <FaCheck /> Confirm Admission
                                    </button>
                                    <button
                                        onClick={() => handleVerify(order._id, 'failed')}
                                        className="w-full py-5 bg-white border-2 border-red-50 text-red-600 rounded-3xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-3 active:scale-95 text-[10px] uppercase tracking-widest"
                                    >
                                        <FaTimes /> Reject Application
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaymentsPage;
