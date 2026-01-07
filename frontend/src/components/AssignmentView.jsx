import { useState, useEffect } from 'react';
import { FaUpload, FaCheckCircle, FaExclamationCircle, FaPaperPlane, FaFileAlt, FaClock } from 'react-icons/fa';
import api from '../utils/api';

const AssignmentView = ({ courseId, lessonId, onComplete }) => {
    const [submission, setSubmission] = useState(null);
    const [content, setContent] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSubmission();
    }, [lessonId]);

    const fetchSubmission = async () => {
        try {
            setFetching(true);
            // In a real app, we'd have a specific endpoint for user's submission for this lesson
            // For now, we fetch all submissions and filter or have a specific route
            const res = await api.get(`/courses/${courseId}/lessons/${lessonId}/submission`);
            setSubmission(res.data);
            if (res.data) {
                setContent(res.data.content || '');
                setFileUrl(res.data.fileUrl || '');
            }
        } catch (err) {
            console.log("No existing submission found");
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post(`/courses/${courseId}/lessons/${lessonId}/assignment`, {
                content,
                fileUrl,
                fileName: fileUrl ? 'assignment_file.pdf' : '' // Mock filename
            });
            setSubmission(res.data);
            alert("Assignment submitted successfully!");
            if (onComplete) onComplete();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit assignment");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p>Loading assignment...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Assignment Header */}
            <div className="bg-gradient-to-br from-gray-900 to-indigo-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <FaFileAlt className="text-9xl rotate-12" />
                </div>
                <div className="relative z-10">
                    <span className="px-3 py-1 bg-indigo-500/30 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block border border-indigo-500/50">Assignment</span>
                    <h2 className="text-3xl font-bold mb-2">Practical Implementation</h2>
                    <p className="text-indigo-100 max-w-2xl">
                        Apply what you've learned in this module. Follow the instructions and submit your work below for instructor review.
                    </p>
                </div>
            </div>

            {/* Submission Status */}
            {submission && (
                <div className={`p-6 rounded-2xl border-2 flex items-center justify-between ${submission.status === 'passed' ? 'bg-green-50 border-green-200 text-green-800' :
                        submission.status === 'failed' ? 'bg-red-50 border-red-200 text-red-800' :
                            'bg-blue-50 border-blue-200 text-blue-800'
                    }`}>
                    <div className="flex items-center">
                        {submission.status === 'passed' ? <FaCheckCircle className="text-2xl mr-4" /> :
                            submission.status === 'failed' ? <FaExclamationCircle className="text-2xl mr-4" /> :
                                <FaClock className="text-2xl mr-4" />}
                        <div>
                            <p className="font-bold">Status: {submission.status.toUpperCase()}</p>
                            <p className="text-sm opacity-80">
                                {submission.status === 'pending-review' ? 'Your assignment is being reviewed by an instructor.' :
                                    submission.status === 'passed' ? `Pass Score: ${submission.score}%` : 'Please revise and resubmit.'}
                            </p>
                        </div>
                    </div>
                    {submission.score > 0 && (
                        <div className="text-3xl font-black">{submission.score}%</div>
                    )}
                </div>
            )}

            {/* Instructor Feedback */}
            {submission?.feedback && (
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                        <FaPaperPlane className="mr-2 text-indigo-600" /> Instructor Feedback
                    </h4>
                    <p className="text-gray-600 italic leading-relaxed">"{submission.feedback}"</p>
                </div>
            )}

            {/* Submission Form */}
            {(!submission || submission.status === 'failed') && (
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-xl font-bold text-gray-900">Your Submission</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Content / Summary</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all h-40"
                                placeholder="Describe your submission or paste your code/links here..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">External Link / File URL</label>
                            <div className="relative">
                                <FaUpload className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={fileUrl}
                                    onChange={(e) => setFileUrl(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="https://github.com/your-repo or Google Drive link"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2 ml-1 italic">Note: Real file uploads are currently simulated with URLs.</p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center text-sm font-medium">
                            <FaExclamationCircle className="mr-2" /> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> :
                            <>
                                <span>Submit Assignment</span>
                                <FaPaperPlane />
                            </>}
                    </button>
                </form>
            )}

            {submission && submission.status !== 'failed' && (
                <div className="bg-gray-50 p-8 rounded-3xl border border-dashed border-gray-200 text-center">
                    <p className="text-gray-500">You have already submitted this assignment.</p>
                    <button
                        onClick={() => setSubmission(null)}
                        className="mt-4 text-indigo-600 font-bold hover:underline py-2 px-4"
                    >
                        Resubmit? (Debugging Mode)
                    </button>
                </div>
            )}
        </div>
    );
};

export default AssignmentView;
