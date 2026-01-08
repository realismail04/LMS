import { useState, useEffect } from 'react';
import { FaChartBar, FaCheckCircle, FaClock, FaExclamationCircle, FaStar, FaArrowRight, FaAward, FaBookOpen, FaTimes } from 'react-icons/fa';
import { useCourse } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import usePageTitle from '../../hooks/usePageTitle';
import CertificateView from '../../components/CertificateView';

const ProgressPage = () => {
    usePageTitle('My Progress');
    const { enrollments, loading: enrollmentLoading } = useCourse();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCert, setSelectedCert] = useState(null);
    const [certificates, setCertificates] = useState([]);

    useEffect(() => {
        fetchSubmissions();
        fetchCertificates();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const { data } = await api.get('/courses/my/submissions');
            setSubmissions(data);
        } catch (err) {
            console.error("Failed to fetch submissions", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCertificates = async () => {
        try {
            const { data } = await api.get('/courses/my/certificates');
            setCertificates(data);
        } catch (err) {
            console.error("Failed to fetch certificates", err);
        }
    };

    if (enrollmentLoading || loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-medium">Calculating your achievements...</p>
            </div>
        );
    }

    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(e => e.progress === 100).length;
    const averageProgress = totalCourses > 0
        ? Math.round(enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / totalCourses)
        : 0;

    return (
        <div className="space-y-10 pb-20 animate-fade-in">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[2rem] shadow-xl text-white col-span-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <FaAward className="text-9xl rotate-12" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-indigo-100 font-bold uppercase text-[10px] tracking-widest mb-1">Overall Learning Mastery</p>
                        <h2 className="text-4xl font-extrabold mb-4 tracking-tighter uppercase italic text-white">{averageProgress}%</h2>
                        <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                            <div className="bg-white h-full" style={{ width: `${averageProgress}%` }} />
                        </div>
                        <p className="mt-4 text-sm font-medium text-indigo-100 opacity-80">
                            You've completed {completedCourses} out of {totalCourses} enrolled courses.
                        </p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-center text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Total Submissions</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 tracking-tighter">{submissions.length}</h3>
                    <div className="mt-4 flex justify-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-center text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Avg. Performance</p>
                    <h3 className="text-3xl font-extrabold text-indigo-600 tracking-tighter">
                        {submissions.length > 0
                            ? Math.round(submissions.reduce((acc, s) => acc + (s.score || 0), 0) / submissions.length)
                            : 0}%
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 font-bold tracking-tighter">Based on graded work</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Detailed Course Progress */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-extrabold text-gray-900 flex items-center tracking-tighter uppercase italic">
                        <FaBookOpen className="mr-3 text-indigo-600" /> Enrolled Courses
                    </h2>

                    <div className="space-y-4">
                        {enrollments.map((enr) => (
                            <div key={enr._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                                            {enr.course?.title?.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-gray-900 leading-tight uppercase tracking-tight">{enr.course?.title}</h4>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                {enr.completedLessons?.length || 0} Lessons Completed
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-gray-900">{enr.progress}%</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${enr.progress}%` }} />
                                </div>

                                {enr.progress === 100 && (
                                    <button
                                        onClick={() => {
                                            const cert = certificates.find(c => (c.course?._id || c.course) === (enr.course?._id || enr.course));
                                            setSelectedCert(cert || { course: enr.course, user: { name: 'Academic Scholar' } });
                                        }}
                                        className="mt-6 w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        <FaAward /> View Certificate
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Feedback & Submissions */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-extrabold text-gray-900 flex items-center tracking-tighter uppercase italic">
                        <FaStar className="mr-3 text-amber-500" /> Intelligence
                    </h2>

                    <div className="space-y-4">
                        {submissions.length > 0 ? submissions.slice(0, 5).map((sub) => (
                            <div key={sub._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 relative group overflow-hidden">
                                <div className={`absolute top-0 right-0 w-1 pt-6 pb-6 h-full ${sub.status === 'passed' ? 'bg-green-500' :
                                    sub.status === 'failed' ? 'bg-red-500' : 'bg-amber-500'
                                    }`} />

                                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${sub.status === 'passed' ? 'bg-green-50 text-green-700' :
                                    sub.status === 'failed' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                                    }`}>
                                    {sub.status || 'review'}
                                </span>

                                <h5 className="font-bold text-gray-900 text-sm mt-2">{sub.course?.title}</h5>

                                {sub.feedback ? (
                                    <p className="text-xs text-gray-500 italic mt-2 leading-relaxed">
                                        "{sub.feedback}"
                                    </p>
                                ) : (
                                    <p className="text-xs text-gray-400 italic mt-2">Waiting for evaluation...</p>
                                )}

                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-900 uppercase">Score: {sub.score || 'TBD'}%</span>
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        {new Date(sub.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center">
                                <p className="text-gray-400 text-sm">No feedback received yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Certificate Modal */}
            {selectedCert && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-xl" onClick={() => setSelectedCert(null)} />
                    <button
                        onClick={() => setSelectedCert(null)}
                        className="absolute top-10 right-10 z-[110] text-white hover:text-indigo-400 transition-colors p-4"
                    >
                        <FaTimes size={32} />
                    </button>
                    <div className="relative z-[110] w-full max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <CertificateView
                            user={selectedCert.user}
                            course={selectedCert.course}
                            certificateId={selectedCert.certificateId}
                            issuedAt={selectedCert.issuedAt || selectedCert.createdAt}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgressPage;
