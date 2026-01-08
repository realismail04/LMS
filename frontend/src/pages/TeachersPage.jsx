import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaGraduationCap, FaArrowRight, FaChalkboardTeacher, FaUsers, FaEnvelope, FaChevronRight, FaStar, FaLinkedin, FaTwitter } from 'react-icons/fa';
import api from '../utils/api';
import usePageTitle from '../hooks/usePageTitle';
import { useAuth } from '../context/AuthContext';

const TeachersPage = () => {
    usePageTitle('Our Instructors | HaxoAcademy');
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const { data } = await api.get('/users/instructors');
                setInstructors(data);
            } catch (error) {
                console.error("Failed to fetch instructors", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInstructors();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Navigation (Simplified for this page) */}
            <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-all">
                                <FaGraduationCap size={24} />
                            </div>
                            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tighter uppercase">HaxoAcademy</span>
                        </div>
                        <div className="flex gap-4">
                            {user ? (
                                <Link to="/dashboard" className="text-sm font-bold text-indigo-600 px-6 py-2.5 rounded-full bg-indigo-50 hover:bg-indigo-100 transition-all">Dashboard</Link>
                            ) : (
                                <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-indigo-600 px-6 py-2.5">Log in</Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-24 pb-20 overflow-hidden bg-gray-950">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-[120px]" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="text-indigo-400 font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Meet Your Mentors</span>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter">
                        World-Class <span className="text-gray-500">Curriculum Authors.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
                        Learn from industry veterans, academic pioneers, and elite developers chosen to guide your synchronization with the future.
                    </p>
                </div>
            </header>

            {/* main section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="font-bold uppercase tracking-widest text-xs">Synchronizing Instructor Data...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {instructors.map((teacher, idx) => (
                            <div key={teacher._id} className="group relative bg-white rounded-[40px] p-8 border border-gray-100 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-4 animate-fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                {/* Profile Visual */}
                                <div className="relative mb-8 text-center">
                                    <div className="w-32 h-32 mx-auto relative">
                                        <img
                                            src={teacher.avatar || `https://i.pravatar.cc/150?u=${teacher._id}`}
                                            alt={teacher.name}
                                            className="w-full h-full object-cover rounded-[32px] ring-4 ring-gray-50 group-hover:ring-indigo-600 transition-all duration-500 shadow-xl"
                                        />
                                        <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg">
                                            <FaChalkboardTeacher size={16} />
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="text-center">
                                    <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">{teacher.name}</h3>
                                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-6">Master Instructor @ HaxoTech</p>

                                    <div className="flex justify-center items-center gap-6 mb-8 py-4 border-y border-gray-50">
                                        <div className="text-center">
                                            <div className="font-black text-gray-900 text-lg">12+</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Courses</div>
                                        </div>
                                        <div className="w-px h-8 bg-gray-100" />
                                        <div className="text-center">
                                            <div className="font-black text-gray-900 text-lg">4.9</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Rating</div>
                                        </div>
                                        <div className="w-px h-8 bg-gray-100" />
                                        <div className="text-center">
                                            <div className="font-black text-gray-900 text-lg">5K+</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Learners</div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-4">
                                        <button className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-600/30 active:scale-95 uppercase text-xs tracking-widest">
                                            View Curriculum
                                        </button>
                                        <a href={`mailto:${teacher.email}`} className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-white hover:text-indigo-600 hover:shadow-lg transition-all border border-transparent hover:border-indigo-100">
                                            <FaEnvelope size={20} />
                                        </a>
                                    </div>

                                    {/* Socials - Decorative for demo */}
                                    <div className="mt-8 flex justify-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                        <FaLinkedin className="text-gray-300 hover:text-indigo-500 cursor-pointer transition-colors" size={18} />
                                        <FaTwitter className="text-gray-300 hover:text-indigo-400 cursor-pointer transition-colors" size={18} />
                                        <FaStar className="text-amber-400" size={18} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Instructor Invitation */}
            <section className="bg-indigo-600 py-24 m-8 rounded-[48px] overflow-hidden relative">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase italic">Share Your Intelligence.</h2>
                    <p className="text-indigo-100 text-xl font-medium mb-12">
                        Do you have what it takes to mentor the next generation of HaxoTech developers? Apply for an instructor node today.
                    </p>
                    <button onClick={() => navigate('/register')} className="bg-white text-indigo-600 px-12 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-2xl active:scale-95">
                        Register As Mentor <FaArrowRight className="inline ml-3" />
                    </button>
                </div>
            </section>

            {/* Footer - Reusing Landing Page Style */}
            <footer className="bg-gray-900 text-white pt-20 pb-10 mt-20" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                                <FaGraduationCap size={20} />
                            </div>
                            <span className="text-xl font-black tracking-tighter uppercase">HaxoAcademy</span>
                        </div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Supported by HaxoTech Technologies</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default TeachersPage;
