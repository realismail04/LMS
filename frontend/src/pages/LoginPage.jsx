import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { FaGraduationCap, FaArrowRight, FaGoogle, FaGithub, FaFingerprint, FaEye, FaEyeSlash } from 'react-icons/fa';
import usePageTitle from '../hooks/usePageTitle';

const LoginPage = () => {
    usePageTitle('Login | HaxoAcademy');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get('redirect');

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'instructor') navigate('/instructor');
            else navigate('/student/progress');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const userData = await login(email, password);

            // Check if there's a redirect URL, otherwise use default navigation
            if (redirectUrl) {
                navigate(redirectUrl);
            } else if (userData.role === 'admin') {
                navigate('/admin');
            } else if (userData.role === 'instructor') {
                navigate('/instructor');
            } else if (userData.role === 'student') {
                navigate('/student/progress');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Left Side - High-Fidelity Visual */}
            <div className="hidden lg:flex w-1/2 bg-gray-950 relative overflow-hidden items-center justify-center p-20">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-gray-950 to-purple-950 opacity-100" />

                {/* Abstract Tech Patterns */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[120px] animate-pulse delay-1000" />
                </div>

                <div className="relative z-10 text-white max-w-xl animate-fade-up">
                    <div className="h-20 w-20 bg-white/5 backdrop-blur-2xl rounded-3xl flex items-center justify-center mb-10 border border-white/10 shadow-2xl">
                        <FaGraduationCap className="h-10 w-10 text-indigo-400" />
                    </div>
                    <h1 className="text-6xl font-extrabold mb-8 leading-[1.1] tracking-tighter uppercase italic text-white">
                        HaxoAcademy <br />
                        <span className="text-gray-500">Access Portal.</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-12 leading-relaxed font-semibold italic tracking-tight">
                        Enter the elite learning network of HaxoTech Technologies. Synchronize your growth with our world-class curriculum engines.
                    </p>

                    <div className="flex -space-x-4 mb-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <img key={i} className="w-12 h-12 rounded-2xl border-2 border-gray-900 object-cover" src={`https://i.pravatar.cc/150?u=login-${i}`} alt="User" />
                        ))}
                    </div>
                    <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-indigo-500 underline decoration-indigo-500/30 underline-offset-8">150,000+ Synchronized Learners</p>
                </div>
            </div>

            {/* Right Side - Sleek Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-24 relative bg-white">
                <div className="w-full max-w-md animate-fade-up">
                    <div className="mb-12">
                        <div className="lg:hidden h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                            <FaGraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tighter uppercase italic">Identity Verification</h2>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Secure login to HaxoAcademy Core</p>
                    </div>

                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-5 bg-red-50 border-r-8 border-red-500 text-red-700 rounded-2xl font-bold text-sm animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-3 ml-2 group-focus-within:text-indigo-600 transition-colors">Credential Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white outline-none transition-all font-bold text-gray-900 placeholder-gray-300 shadow-sm"
                                    placeholder="Enter your academy email"
                                    required
                                />
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-3 ml-2 group-focus-within:text-indigo-600 transition-colors">System Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white outline-none transition-all font-bold text-gray-900 placeholder-gray-300 shadow-sm pr-16"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center">
                                <input id="remember" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-100 rounded-lg focus:ring-indigo-500 cursor-pointer" />
                                <label htmlFor="remember" className="ml-3 block text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer">Stay Active</label>
                            </div>
                            <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-500 uppercase tracking-widest">Lost Credentials?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center bg-gray-900 text-white px-8 py-5 rounded-[24px] font-bold hover:bg-indigo-600 transition-all shadow-2xl hover:shadow-indigo-600/30 transform active:scale-95 uppercase italic tracking-tight"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Authenticate Access <FaFingerprint className="ml-3" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-sm font-bold text-gray-400 italic">
                            New to the Academy?{' '}
                            <Link to={redirectUrl ? `/register?redirect=${redirectUrl}` : '/register'} className="font-black text-indigo-600 hover:text-indigo-500 not-italic uppercase tracking-widest ml-1 border-b-2 border-indigo-600/20 pb-1">
                                Secure Admission
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
