import { useState, useEffect } from 'react';
import { FaGraduationCap, FaCheckCircle, FaTimesCircle, FaClock, FaEdit, FaSearch, FaFilter, FaFileAlt, FaPaperPlane, FaUserGraduate } from 'react-icons/fa';
import api from '../../utils/api';
import usePageTitle from '../../hooks/usePageTitle';

const StudentsPage = () => {
    usePageTitle('Students Manager');
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/courses/instructor/submissions');
            setSubmissions(data);
        } catch (error) {
            console.error("Failed to fetch submissions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGrade = async (e) => {
        e.preventDefault();
        if (!selectedSubmission) return;

        setSubmitting(true);
        try {
            await api.put(`/courses/submissions/${selectedSubmission._id}/grade`, {
                score: parseInt(grade),
                feedback
            });
            alert("Graded successfully!");
            setSelectedSubmission(null);
            fetchSubmissions();
        } catch (error) {
            alert("Failed to grade submission");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredSubmissions = submissions.filter(s =>
        s.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.course?.title?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'passed': return 'bg-green-100 text-green-700 border-green-200';
            case 'failed': return 'bg-red-100 text-red-700 border-red-200';
            case 'pending-review': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center tracking-tighter uppercase italic">
                        <FaUserGraduate className="mr-3 text-indigo-600" /> Evaluation Center
                    </h1>
                    <p className="text-gray-500 mt-1 font-bold uppercase tracking-widest text-[10px]">Review student performance and provide qualitative feedback.</p>
                </div>

                <div className="relative group">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search students or courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 pr-6 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none w-full md:w-80 transition-all bg-white shadow-sm"
                    />
                </div>
            </div>

            {/* Submissions Table */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-400 font-medium">Fetching evaluation data...</p>
                    </div>
                ) : filteredSubmissions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-bold uppercase tracking-widest border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5">Student</th>
                                    <th className="px-8 py-5">Course / Context</th>
                                    <th className="px-8 py-5">Type</th>
                                    <th className="px-8 py-5">Score</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredSubmissions.map((sub) => (
                                    <tr key={sub._id} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                    {sub.user?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-extrabold text-gray-900 uppercase tracking-tight">{sub.user?.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{sub.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-gray-700 text-sm italic uppercase tracking-tight">{sub.course?.title}</p>
                                            <p className="text-[10px] text-gray-300 mt-1 uppercase tracking-[0.2em] font-bold">
                                                ID: {sub.lesson?.substring(0, 8)}...
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest ${sub.type === 'quiz' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                {sub.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-bold text-gray-900 italic">
                                            {sub.status === 'pending-review' ? '-' : `${sub.score}%`}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(sub.status)}`}>
                                                {sub.status === 'pending-review' ? 'Pending Seat' : sub.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedSubmission(sub);
                                                    setGrade(sub.score || '');
                                                    setFeedback(sub.feedback || '');
                                                }}
                                                className="p-3 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all"
                                            >
                                                <FaEdit />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <FaClock className="text-6xl text-gray-100 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">No submissions found</h3>
                        <p className="text-gray-500 mt-2">Active student work will appear here once submitted.</p>
                    </div>
                )}
            </div>

            {/* Grading Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up">
                        <div className="bg-indigo-600 p-8 text-white relative">
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="absolute top-6 right-6 text-2xl hover:scale-110 transition-transform"
                            >
                                <FaTimesCircle />
                            </button>
                            <span className="px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">Reviewing Manuscript</span>
                            <h2 className="text-2xl font-extrabold tracking-tight uppercase italic text-white">{selectedSubmission.user?.name}</h2>
                            <p className="text-indigo-100 mt-1 opacity-80 font-bold uppercase tracking-widest text-[10px]">{selectedSubmission.course?.title}</p>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Student Content */}
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 max-h-48 overflow-y-auto">
                                <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 flex items-center">
                                    <FaFileAlt className="mr-2" /> Student's Submission
                                </h4>
                                <p className="text-gray-700 leading-relaxed font-medium">
                                    {selectedSubmission.type === 'quiz' ? 'Detailed quiz report is being consolidated...' : (selectedSubmission.content || 'No text content.')}
                                </p>
                                {selectedSubmission.fileUrl && (
                                    <a
                                        href={selectedSubmission.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-flex items-center text-indigo-600 font-bold hover:underline uppercase tracking-widest text-[10px]"
                                    >
                                        Open External Artifact <FaPaperPlane className="ml-2 text-xs" />
                                    </a>
                                )}
                            </div>

                            <form onSubmit={handleGrade} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Grade Index (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={grade}
                                            onChange={(e) => setGrade(e.target.value)}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-bold"
                                            placeholder="75"
                                            required
                                        />
                                    </div>
                                    <div className="flex items-end pb-1">
                                        <p className="text-[10px] text-gray-400 italic">Scores below 70% are marked as Failed by default.</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Qualitative Intelligence</label>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none h-32 font-medium"
                                        placeholder="Great job on the implementation! Consider improving..."
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Transmitting Data...' : 'Commit Evaluation'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentsPage;
