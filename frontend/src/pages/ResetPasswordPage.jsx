import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaLock, FaKey, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import api from '../utils/api';
import usePageTitle from '../hooks/usePageTitle';

const ResetPasswordPage = () => {
    usePageTitle('Reset Identity | HaxoAcademy');
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Access tokens do not match.');
        }

        setLoading(true);
        setError('');

        try {
            await api.post(`/auth/reset-password/${token}`, { password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Token synchronization failed. Link may be expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6 font-sans selection:bg-indigo-100">
            <div className="w-full max-w-xl">
                {/* Brand Header */}
                <div className="text-center mb-12 animate-fade-up">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-600/30">
                        <FaKey className="text-white text-4xl" />
                    </div>
                    <h2 className="text-5xl font-extrabold text-gray-900 tracking-tighter uppercase italic mb-4">Reset Identity</h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Credential Overwrite Protocol</p>
                </div>

                <div className="bg-white rounded-[48px] shadow-3xl p-12 lg:p-16 border border-gray-100 animate-fade-up delay-100">
                    {success ? (
                        <div className="text-center space-y-8 py-10">
                            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto text-4xl animate-bounce">
                                <FaCheckCircle />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 uppercase italic">Identity Updated</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                Your access tokens have been successfully synchronized. Redirecting to Identity Portal...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {error && (
                                <div className="p-6 bg-red-50 border-r-8 border-red-500 text-red-700 rounded-2xl font-bold text-sm animate-shake">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] ml-4">New System Password</label>
                                    <div className="relative">
                                        <FaLock className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300" />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-16 pr-10 py-6 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-indigo-600/20 focus:bg-white outline-none transition-all font-bold text-gray-900 text-lg placeholder-gray-300"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] ml-4">Confirm System Password</label>
                                    <div className="relative">
                                        <FaLock className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300" />
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-16 pr-10 py-6 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-indigo-600/20 focus:bg-white outline-none transition-all font-bold text-gray-900 text-lg placeholder-gray-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center bg-gray-900 text-white px-8 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-2xl hover:shadow-indigo-600/40 active:scale-95"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Finalize Overwrite <FaArrowRight className="ml-3" /></>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
