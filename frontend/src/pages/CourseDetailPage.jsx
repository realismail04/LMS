import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import {
    FaArrowLeft, FaPlay, FaGraduationCap, FaClock, FaChartLine,
    FaGlobe, FaCertificate, FaChevronDown, FaChevronUp,
    FaLock, FaCheckCircle, FaStar, FaCreditCard, FaFileAlt, FaHourglassHalf
} from 'react-icons/fa';
import usePageTitle from '../hooks/usePageTitle';

const CourseDetailPage = () => {
    const { courseId } = useParams();
    const { user } = useAuth();
    const { enrollments, orders, enrollInCourse, fetchOrders } = useCourse();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openModules, setOpenModules] = useState({});
    const [paymentModal, setPaymentModal] = useState(false);

    // Payment Form State
    const [transactionId, setTransactionId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
    const [submitting, setSubmitting] = useState(false);

    usePageTitle(course?.title || 'Academy Course');

    const isEnrolled = enrollments.some(e => (e.course?._id || e.course) === courseId);
    const pendingOrder = orders.find(o => (o.course?._id || o.course) === courseId && o.status === 'pending');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await api.get(`/courses/${courseId}`);
                setCourse(data);
                if (data.modules?.length > 0) {
                    setOpenModules({ [data.modules[0]._id]: true });
                }
            } catch (error) {
                console.error("Failed to fetch course", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    const toggleModule = (id) => {
        setOpenModules(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleEnrollment = async () => {
        if (!user) {
            // Store the current course URL as a redirect parameter
            navigate(`/login?redirect=/courses/${courseId}`);
            return;
        }

        if (course.price > 0) {
            setPaymentModal(true);
            return;
        }

        try {
            await enrollInCourse(courseId);
            navigate(`/courses/${courseId}/learn`);
        } catch (error) {
            alert(error.response?.data?.message || 'Admission request failed');
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/courses/payment', {
                courseId,
                transactionId,
                paymentMethod,
                amount: course.price
            });
            await fetchOrders(); // Update global context
            setPaymentModal(false);
            // Non-blocking notification or simple success state is preferred over alert for "sleek" UI
        } catch (error) {
            alert(error.response?.data?.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        </div>
    );

    if (!course) return <div className="p-20 text-center font-black text-gray-400">Curriculum not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Dark Header Section */}
            <div className="bg-gray-900 text-white pt-32 pb-60 relative overflow-hidden animate-fade-up">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 skew-x-12 translate-x-10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-indigo-300 font-bold mb-8 hover:text-white transition-colors uppercase text-xs tracking-widest">
                        <FaArrowLeft /> Academy Marketplace
                    </button>
                    <div className="flex flex-col lg:flex-row gap-16">
                        <div className="flex-1">
                            <div className="flex gap-4 mb-6">
                                <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                                    {course.category}
                                </span>
                                <span className="px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-500 flex items-center gap-1">
                                    <FaStar /> HAXO CHOICE
                                </span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter mb-8 leading-[1.05] uppercase italic">
                                {course.title}
                            </h1>
                            <p className="text-xl text-gray-400 font-semibold leading-relaxed max-w-2xl mb-10">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap gap-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 border border-white/10">
                                        <FaGraduationCap size={24} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Students</div>
                                        <div className="text-lg font-bold tracking-tight">1,248+</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 border border-white/10">
                                        <FaChartLine size={24} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Level</div>
                                        <div className="text-lg font-bold tracking-tight capitalize">{course.level}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 border border-white/10">
                                        <FaGlobe size={24} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Language</div>
                                        <div className="text-lg font-bold tracking-tight">English</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content & Sticky Card */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Content Column */}
                    <div className="flex-1 space-y-12">
                        {/* What you will learn */}
                        <div className="bg-white rounded-[48px] p-12 shadow-2xl shadow-gray-200/50 border border-gray-100 animate-fade-up">
                            <h2 className="text-3xl font-extrabold tracking-tighter mb-10 uppercase italic text-gray-900">Mastery Objectives</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    "Enterprise Architecture Standards",
                                    "Advanced HaxoTech Methodologies",
                                    "Direct Mentorship Ecosystem",
                                    "Global Network Integration"
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="mt-1 text-indigo-600 group-hover:scale-125 transition-transform"><FaCheckCircle /></div>
                                        <p className="font-semibold text-gray-600">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Curriculum */}
                        <div className="bg-white rounded-[48px] p-12 shadow-2xl shadow-gray-200/50 border border-gray-100 animate-fade-up delay-100">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                                <h2 className="text-3xl font-extrabold tracking-tighter uppercase italic text-gray-900">Curriculum Blueprint</h2>
                                <span className="font-bold text-gray-300 text-[10px] uppercase tracking-[0.3em] bg-gray-50 px-4 py-2 rounded-full">
                                    {course.modules?.length} Phases • {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Units
                                </span>
                            </div>

                            <div className="space-y-6">
                                {course.modules.map((module) => (
                                    <div key={module._id} className="border border-gray-100 rounded-[32px] overflow-hidden bg-gray-50/50 hover:border-indigo-200 transition-colors">
                                        <button
                                            onClick={() => toggleModule(module._id)}
                                            className="w-full flex items-center justify-between p-8 bg-white hover:bg-indigo-50/30 transition-all"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-bold text-xs uppercase shadow-lg">
                                                    P{course.modules.indexOf(module) + 1}
                                                </div>
                                                <span className="text-xl font-bold tracking-tight uppercase italic text-gray-900">{module.title}</span>
                                            </div>
                                            <div className={`transition-transform duration-300 ${openModules[module._id] ? 'rotate-180' : ''}`}>
                                                <FaChevronDown />
                                            </div>
                                        </button>

                                        {openModules[module._id] && (
                                            <div className="p-6 space-y-3">
                                                {module.lessons.map((lesson) => (
                                                    <div key={lesson._id} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl group hover:border-indigo-600/30 transition-all">
                                                        <div className="flex items-center gap-5">
                                                            <div className="text-gray-300 group-hover:text-indigo-600 transition-colors">
                                                                {lesson.type === 'video' ? <FaPlay size={14} /> : lesson.type === 'quiz' ? <FaChartLine size={14} /> : <FaFileAlt size={14} />}
                                                            </div>
                                                            <span className="font-semibold text-gray-700">{lesson.title}</span>
                                                        </div>
                                                        <div className="flex items-center gap-5">
                                                            {lesson.duration && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{lesson.duration}</span>}
                                                            {!isEnrolled && <FaLock className="text-gray-200" size={12} />}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Floating Pricing Card */}
                    <div className="w-full lg:w-[400px] animate-fade-up delay-200">
                        <div className="lg:sticky lg:top-32 bg-white rounded-[48px] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
                            <div className="relative aspect-video group cursor-pointer">
                                <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Preview" />
                                <div className="absolute inset-0 bg-gray-900/40 group-hover:bg-gray-900/20 transition-all flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-2xl group-hover:scale-110 active:scale-90 transition-transform">
                                        <FaPlay />
                                    </div>
                                </div>
                            </div>
                            <div className="p-12">
                                <div className="flex items-center gap-4 mb-10">
                                    <span className="text-5xl font-extrabold text-gray-900 tracking-tighter">
                                        {course.price === 0 ? 'FREE' : `$${course.price}`}
                                    </span>
                                    {course.price > 0 && <span className="text-2xl text-gray-300 font-semibold line-through tracking-tighter">$399</span>}
                                </div>

                                {pendingOrder ? (
                                    <div className="w-full p-6 bg-orange-50 border-2 border-orange-200 rounded-3xl text-center animate-pulse">
                                        <div className="flex items-center justify-center gap-3 text-orange-600 font-bold uppercase text-xs tracking-widest mb-2">
                                            <FaHourglassHalf /> Admission Pending
                                        </div>
                                        <p className="text-xs text-orange-500 font-semibold">The HaxoAcademy Admission Office is reviewing your request.</p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleEnrollment}
                                        disabled={isEnrolled}
                                        className={`w-full py-6 rounded-2xl font-bold text-lg transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 ${isEnrolled
                                            ? 'bg-gray-100 text-gray-400 cursor-default shadow-none'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/40'
                                            }`}
                                    >
                                        {isEnrolled ? (
                                            <><FaCheckCircle size={20} /> ENROLLED</>
                                        ) : (
                                            course.price === 0 ? 'SECURE ADMISSION' : 'GET LIFETIME ACCESS'
                                        )}
                                    </button>
                                )}

                                {isEnrolled && (
                                    <button
                                        onClick={() => navigate(`/courses/${courseId}/learn`)}
                                        className="w-full mt-4 py-5 border-2 border-gray-900 text-gray-900 rounded-2xl font-bold text-lg hover:bg-gray-900 hover:text-white transition-all active:scale-95 uppercase italic"
                                    >
                                        Enter Classroom
                                    </button>
                                )}

                                <div className="mt-10 space-y-6">
                                    <div className="flex items-center gap-5 text-gray-600 group">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            <FaClock />
                                        </div>
                                        <span className="text-sm font-semibold uppercase tracking-wider">Lifetime Platform Access</span>
                                    </div>
                                    <div className="flex items-center gap-5 text-gray-600 group">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            <FaCertificate />
                                        </div>
                                        <span className="text-sm font-semibold uppercase tracking-wider">Verified Haxo Certificate</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment / Waitlist Modal */}
            {paymentModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" onClick={() => !submitting && setPaymentModal(false)} />
                    <div className="relative bg-white w-full max-w-2xl rounded-[60px] shadow-3xl p-16 animate-in zoom-in duration-500">
                        <div className="text-center mb-12">
                            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner ring-8 ring-white">
                                <FaCreditCard size={48} />
                            </div>
                            <h2 className="text-5xl font-extrabold tracking-tighter mb-6 uppercase italic text-gray-900">Admission Office</h2>
                            <p className="text-gray-500 font-semibold leading-relaxed max-w-md mx-auto">
                                Secure your spot at **HaxoAcademy**. Complete the transfer of **${course.price}** to join the intensive learning waitlist.
                            </p>
                        </div>

                        <div className="bg-gray-950 p-10 rounded-[40px] mb-12 border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.4em] mb-6">Master Haxo Accounts</div>
                            <div className="space-y-4 font-bold text-sm text-white tracking-widest uppercase italic">
                                <div className="flex justify-between border-b border-white/5 pb-3">
                                    <span className="text-gray-500">Entity:</span>
                                    <span className="text-indigo-500">HaxoTech Global Bank</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-3">
                                    <span className="text-gray-500">Account:</span>
                                    <span className="text-white text-xl tracking-[0.2em] font-mono not-italic">8899-0011-2233</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">BIC:</span>
                                    <span className="text-white">HAXO-GLOBAL-HQ</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handlePaymentSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4 ml-4">Channel</label>
                                    <select
                                        className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-2 border-transparent font-bold outline-none focus:border-indigo-600 transition-all cursor-pointer appearance-none text-gray-900"
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        <option>Bank Transfer</option>
                                        <option>Direct Deposit</option>
                                        <option>Crypto (USDT/BTC)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4 ml-4">Reference ID</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Proof of transfer"
                                        className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-2 border-transparent font-bold outline-none focus:border-indigo-600 transition-all text-gray-900"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setPaymentModal(false)}
                                    className="flex-1 py-6 bg-gray-50 text-gray-400 rounded-2xl font-bold hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-[2] py-6 bg-indigo-600 text-white rounded-3xl font-bold hover:bg-indigo-700 shadow-2xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-3 active:scale-95 uppercase italic"
                                >
                                    {submitting ? (
                                        <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        'Submit Admission'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetailPage;
