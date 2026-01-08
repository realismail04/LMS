import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { FaGraduationCap, FaChalkboardTeacher, FaArrowRight, FaFingerprint } from 'react-icons/fa';
import usePageTitle from '../hooks/usePageTitle';

const RegisterPage = () => {
    usePageTitle('Join | HaxoAcademy');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get('redirect');

    const validateForm = () => {
        if (name.length < 2) {
            setError('Name must be at least 2 characters long');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);
        try {
            await register(name, email, password, role);
            // Check if there's a redirect URL, otherwise use default navigation
            if (redirectUrl) {
                navigate(redirectUrl);
            } else if (role === 'instructor') {
                navigate('/instructor');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error("Registration Error:", err);
            setError(err.response?.data?.message || err.message || 'Academic registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Left Side - Deep Space Aesthetic */}
            <div className="hidden lg:flex w-1/2 bg-gray-950 relative overflow-hidden items-center justify-center p-20">
                <div className="absolute inset-0 bg-gradient-to-tr from-gray-950 via-gray-900 to-indigo-950 opacity-100" />

                {/* Orbital Rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-indigo-600/10 rounded-full" />

                <div className="relative z-10 text-white max-w-xl animate-fade-up">
                    <h1 className="text-6xl font-extrabold mb-8 leading-[1.1] tracking-tighter uppercase italic text-white">
                        Join The Academy <br />
                        <span className="text-gray-500 underline decoration-indigo-600/30">Intelligence.</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-12 leading-relaxed font-semibold italic tracking-tight">
                        Become part of the HaxoAcademy ecosystem. Access high-fidelity knowledge and industry-standard mentorship engines.
                    </p>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[32px] border border-white/10 hover:bg-white/10 transition-colors group">
                            <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-indigo-400 mb-3">Learner Mode</h3>
                            <p className="text-xs text-gray-400 leading-relaxed font-semibold">Unrestricted access to the global curriculum marketplace.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[32px] border border-white/10 hover:bg-white/10 transition-colors group">
                            <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-purple-400 mb-3">Mentor Tools</h3>
                            <p className="text-xs text-gray-400 leading-relaxed font-semibold">Deploy your own curriculum and track student synchronization.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Sleek Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-24 relative bg-white overflow-y-auto">
                <div className="w-full max-w-md animate-fade-up">
                    <div className="mb-12">
                        <div className="lg:hidden h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                            <FaGraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tighter uppercase italic">Secure Admission</h2>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Register your HaxoAcademy Identity</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-5 bg-red-50 border-r-8 border-red-500 text-red-700 rounded-2xl font-bold text-sm animate-shake">
                                {error}
                            </div>
                        )}

                        {/* Interactive Role Selection */}
                        <div className="grid grid-cols-2 gap-6 mb-10">
                            <button
                                type="button"
                                onClick={() => setRole('student')}
                                className={`flex flex-col items-center justify-center p-6 rounded-[32px] border-2 transition-all duration-500 ${role === 'student' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xl shadow-indigo-600/10' : 'border-gray-50 bg-gray-50 grayscale hover:grayscale-0 text-gray-400 opacity-60'}`}
                            >
                                <FaGraduationCap className="h-8 w-8 mb-3" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Learner</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('instructor')}
                                className={`flex flex-col items-center justify-center p-6 rounded-[32px] border-2 transition-all duration-500 ${role === 'instructor' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xl shadow-indigo-600/10' : 'border-gray-50 bg-gray-50 grayscale hover:grayscale-0 text-gray-400 opacity-60'}`}
                            >
                                <FaChalkboardTeacher className="h-8 w-8 mb-3" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Mentor</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-3 ml-2 group-focus-within:text-indigo-600 transition-colors">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white outline-none transition-all font-bold text-gray-900 placeholder-gray-300 shadow-sm"
                                    placeholder="Enter your full identity"
                                    required
                                />
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-3 ml-2 group-focus-within:text-indigo-600 transition-colors">System Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white outline-none transition-all font-bold text-gray-900 placeholder-gray-300 shadow-sm"
                                    placeholder="email@haxoteach.com"
                                    required
                                />
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-3 ml-2 group-focus-within:text-indigo-600 transition-colors">Security Key</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white outline-none transition-all font-bold text-gray-900 placeholder-gray-300 shadow-sm"
                                    placeholder="Create a strong key"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center bg-gray-950 text-white px-8 py-5 rounded-[24px] font-bold hover:bg-indigo-600 transition-all shadow-2xl hover:shadow-indigo-600/30 transform active:scale-95 uppercase italic tracking-tight mt-6"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Create Identity <FaFingerprint className="ml-3" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-sm font-bold text-gray-400 italic">
                            Already synchronized?{' '}
                            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 not-italic uppercase tracking-widest ml-1 border-b-2 border-indigo-600/20 pb-1">
                                Login Access
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
