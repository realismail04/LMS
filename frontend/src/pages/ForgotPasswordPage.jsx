import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaGraduationCap, FaArrowLeft, FaPaperPlane, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import api from '../utils/api';
import usePageTitle from '../hooks/usePageTitle';

const ForgotPasswordPage = () => {
    usePageTitle('Lost Credentials | HaxoAcademy');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            setMessage(data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initiate recovery process.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6 font-sans selection:bg-indigo-100">
            <div className="w-full max-w-xl">
                {/* Brand Header */}
                <div className="text-center mb-12 animate-fade-up">
                    <button
                        onClick={() => navigate('/login')}
                        className="inline-flex items-center gap-2 text-indigo-600 font-bold uppercase text-[10px] tracking-[0.3em] mb-8 hover:gap-4 transition-all"
                    >
                        <FaArrowLeft /> Return to Identity Portal
                    </button>
                    <div className="w-20 h-20 bg-gray-900 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-600/20">
                        <FaGraduationCap className="text-white text-4xl" />
                    </div>
                    <h2 className="text-5xl font-extrabold text-gray-900 tracking-tighter uppercase italic mb-4">Lost Credentials?</h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Credential Synchronization Engine</p>
                </div>

                <div className="bg-white rounded-[48px] shadow-3xl p-12 lg:p-16 border border-gray-100 animate-fade-up delay-100 relative overflow-hidden">
                    {/* Decorative Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />

                    {message ? (
                        <div className="text-center space-y-8 py-10">
                            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto text-4xl animate-bounce">
                                <FaCheckCircle />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 uppercase italic">Transmission Successful</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                {message}
                            </p>
                            <div className="p-6 bg-amber-50 border-2 border-amber-100 rounded-3xl text-amber-700 text-sm font-bold flex items-center gap-4">
                                <FaExclamationTriangle className="text-2xl shrink-0" />
                                <span>Check the system logs or your developer console to retrieve the generated reset link.</span>
                            </div>
                            <Link
                                to="/login"
                                className="inline-block px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
                            >
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-10">
                            {error && (
                                <div className="p-6 bg-red-50 border-r-8 border-red-500 text-red-700 rounded-2xl font-bold text-sm animate-shake">
                                    {error}
                                </div>
                            )}

                            <p className="text-gray-500 text-center font-semibold italic text-lg mb-4">
                                "Enter your registered email to synchronize your access tokens."
                            </p>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] ml-4">Authorized Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="yourname@organization.com"
                                    className="w-full px-10 py-6 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-indigo-600/20 focus:bg-white outline-none transition-all font-bold text-gray-900 text-lg placeholder-gray-300"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center bg-gray-900 text-white px-8 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-2xl hover:shadow-indigo-600/40 active:scale-95"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Initiate Recovery Sequence <FaPaperPlane className="ml-3" /></>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
