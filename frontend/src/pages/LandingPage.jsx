import { useNavigate, Link } from 'react-router-dom';
import { FaGraduationCap, FaChalkboardTeacher, FaRocket, FaGlobe, FaShieldAlt, FaArrowRight, FaStar, FaPlay, FaUsers, FaCheckCircle, FaQuoteLeft, FaPlus, FaMinus, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { useState } from 'react';
import { useCourse } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';

const LandingPage = () => {
    usePageTitle('Welcome to HaxoAcademy');
    const navigate = useNavigate();
    const { courses } = useCourse();
    const { user } = useAuth();
    const [activeFaq, setActiveFaq] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const featuredCourses = courses.slice(0, 3);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const stats = [
        { label: 'Active Students', value: '150K+', icon: <FaUsers /> },
        { label: 'Courses Created', value: '1,200+', icon: <FaRocket /> },
        { label: 'Expert Mentors', value: '450+', icon: <FaChalkboardTeacher /> },
        { label: 'Global Reach', value: '85+', icon: <FaGlobe /> }
    ];

    const testimonials = [
        { name: 'Sarah Jenkins', role: 'Full-Stack Developer', text: 'HaxoAcademy transformed my career path. The deep curriculum and hands-on modules are unmatched in the industry.', avatar: 'https://i.pravatar.cc/150?u=sarah' },
        { name: 'Michael Chen', role: 'Data Scientist', text: 'The interactive learning engine is incredible. I learned more in 3 months here than I did in a year of self-study.', avatar: 'https://i.pravatar.cc/150?u=michael' },
        { name: 'Elena Rodriguez', role: 'UI/UX Designer', text: 'The community support and expert mentorship provided the perfect ecosystem for my growth as a designer.', avatar: 'https://i.pravatar.cc/150?u=elena' }
    ];

    const faqs = [
        { q: "How does the admission process work?", a: "Once you select a course and complete the payment/waitlist form, our admission office reviews your application within 24-48 hours. You will be notified via email upon approval." },
        { q: "Is there a free trial available?", a: "Yes! We offer a selection of open-source introductory courses that are 100% free to start. This allows you to experience the HaxoAcademy ecosystem before committing." },
        { q: "Can I teach on HaxoAcademy?", a: "Absolutely. We are always looking for industry experts to share their knowledge. You can register as an instructor and submit your course proposal through your dashboard." },
        { q: "Do I get a certificate upon completion?", a: "Yes, every premium learning path on HaxoAcademy includes a verified digital certificate that you can share on LinkedIn and your professional portfolio." }
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 scroll-smooth">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-all">
                                <FaGraduationCap size={24} />
                            </div>
                            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tighter uppercase">HaxoAcademy</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
                            <a href="#courses" className="hover:text-indigo-600 transition-colors">Courses</a>
                            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                            <Link to="/teachers" className="hover:text-indigo-600 transition-colors">Instructors</Link>
                            <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
                            <Link to="/courses" className="hover:text-indigo-600 transition-colors">Marketplace</Link>
                        </div>
                        <div className="hidden md:flex gap-4 items-center">
                            {user ? (
                                <Link to="/dashboard" className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-100 transition-all border border-indigo-100">
                                    <FaUserCircle size={18} />
                                    <span>Hi, {user.name.split(' ')[0]}</span>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 px-4">Log in</Link>
                                    <Link to="/register" className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95">Join Now</Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Toggle */}
                        <button className="md:hidden text-gray-900 p-2" onClick={toggleMenu}>
                            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-fade-in z-40">
                        <div className="flex flex-col p-6 space-y-4 font-bold text-gray-900 text-center">
                            <a href="#courses" onClick={toggleMenu} className="py-2 hover:text-indigo-600">Courses</a>
                            <a href="#features" onClick={toggleMenu} className="py-2 hover:text-indigo-600">Features</a>
                            <Link to="/teachers" onClick={toggleMenu} className="py-2 hover:text-indigo-600">Instructors</Link>
                            <a href="#faq" onClick={toggleMenu} className="py-2 hover:text-indigo-600">FAQ</a>
                            <Link to="/courses" onClick={toggleMenu} className="py-2 hover:text-indigo-600">Marketplace</Link>
                            <hr className="border-gray-100 my-2" />
                            {user ? (
                                <Link to="/dashboard" onClick={toggleMenu} className="py-3 bg-indigo-600 text-white rounded-xl shadow-lg flex items-center justify-center gap-2">
                                    <FaUserCircle /> Hi, {user.name}
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" onClick={toggleMenu} className="py-2 text-gray-500 hover:text-indigo-600">Log in</Link>
                                    <Link to="/register" onClick={toggleMenu} className="py-3 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-indigo-600 active:scale-95 transition-all">Join HaxoAcademy</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section - Redesigned */}
            <header className="relative pt-32 pb-32 overflow-hidden bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Gradient Orbs */}
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-pink-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse delay-500" />

                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Left Content */}
                        <div className="flex-1 text-center lg:text-left animate-fade-up">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full text-sm font-bold mb-8 shadow-2xl hover:scale-105 transition-transform">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <FaRocket className="text-indigo-300" />
                                <span className="uppercase tracking-widest">Next-Gen Learning Platform</span>
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.95] mb-8 tracking-tighter">
                                Transform Your
                                <br />
                                <span className="relative inline-block mt-2">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
                                        Career Path
                                    </span>
                                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full" />
                                </span>
                            </h1>

                            {/* Subheading */}
                            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-2xl leading-relaxed font-medium mx-auto lg:mx-0">
                                Join <span className="text-white font-bold">150,000+ learners</span> mastering cutting-edge skills with HaxoAcademy's premium educational ecosystem.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start mb-12">
                                <Link
                                    to="/courses"
                                    className="group relative w-full sm:w-auto px-10 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-3 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="relative z-10 uppercase tracking-wider">Start Learning</span>
                                    <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <button className="group w-full sm:w-auto px-10 py-6 bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FaPlay className="ml-0.5" />
                                    </div>
                                    <span className="uppercase tracking-wider">Watch Demo</span>
                                </button>
                            </div>

                            {/* Stats Row */}
                            <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
                                {[
                                    { value: '150K+', label: 'Students' },
                                    { value: '1,200+', label: 'Courses' },
                                    { value: '450+', label: 'Mentors' }
                                ].map((stat, idx) => (
                                    <div key={idx} className="text-center lg:text-left">
                                        <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                                        <div className="text-sm text-gray-400 uppercase tracking-widest font-bold">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Visual */}
                        <div className="flex-1 relative animate-fade-up delay-200">
                            {/* Floating Cards */}
                            <div className="relative w-full max-w-lg mx-auto">
                                {/* Main Card */}
                                <div className="relative z-10 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] p-8 shadow-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                        alt="Students Learning"
                                        className="w-full h-[400px] object-cover rounded-3xl"
                                    />

                                    {/* Floating Achievement Card */}
                                    <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-100 animate-float">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                                                <FaCheckCircle size={28} />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-black text-gray-900">98%</div>
                                                <div className="text-xs text-gray-600 font-bold uppercase tracking-wider">Success Rate</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating Rating Card */}
                                    <div className="absolute -top-6 -right-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 shadow-2xl animate-float delay-300">
                                        <div className="flex items-center gap-2 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className="text-white" size={16} />
                                            ))}
                                        </div>
                                        <div className="text-white font-black text-lg">4.9/5.0</div>
                                        <div className="text-white/80 text-xs font-bold uppercase tracking-wider">Rating</div>
                                    </div>
                                </div>

                                {/* Background Decoration */}
                                <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-2xl" />
                                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full blur-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Section */}
            <section className="py-20 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center group hover:-translate-y-2 transition-transform duration-300">
                                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    {stat.icon}
                                </div>
                                <div className="text-4xl font-extrabold text-gray-900 mb-2">{stat.value}</div>
                                <div className="text-xs uppercase font-semibold text-gray-400 tracking-[0.2em]">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Courses */}
            <section id="courses" className="py-32 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 animate-fade-up">
                        <div>
                            <span className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-4 block underline decoration-4 underline-offset-8">PREMIUM CURRICULUM</span>
                            <h2 className="text-5xl font-extrabold tracking-tighter text-gray-900">Featured Academy Paths</h2>
                        </div>
                        <Link to="/courses" className="px-8 py-4 bg-white border-2 border-gray-200 rounded-2xl font-bold hover:border-indigo-600 transition-all flex items-center gap-2 active:scale-95">
                            View All Academy <FaArrowRight />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {featuredCourses.length > 0 ? (
                            featuredCourses.map((course, idx) => (
                                <div key={course._id} className={`group bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-4 animate-fade-up`} style={{ animationDelay: `${idx * 150}ms` }}>
                                    <div className="relative h-64">
                                        <img src={course.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={course.title} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                        <div className="absolute top-6 left-6 flex gap-2">
                                            <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-900 uppercase">{course.category}</span>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{course.title}</h3>
                                        <p className="text-gray-500 font-medium mb-8 line-clamp-2 leading-relaxed">{course.description}</p>
                                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                            <div className="flex items-center gap-3">
                                                <img src={`https://i.pravatar.cc/150?u=${course.user}`} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100" alt="Instructor" />
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">HaxoTeam</span>
                                            </div>
                                            <div className="text-2xl font-extrabold text-indigo-600">
                                                {course.price === 0 ? 'FREE' : `$${course.price}`}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/courses/${course._id}`)}
                                            className="w-full mt-8 py-4 bg-gray-50 text-gray-900 font-bold rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            View Admission Details <FaArrowRight />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                <div className="text-4xl font-black text-gray-300 mb-4">Establishing HaxoAcademy Hub...</div>
                            </div>
                        )}
                    </div>
                </div>
            </section >

            {/* Testimonials */}
            < section className="py-32 bg-white overflow-hidden" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20 animate-fade-up">
                    <h2 className="text-5xl font-extrabold tracking-tighter text-gray-900 mb-6">Success Stories</h2>
                    <p className="text-xl text-gray-500 font-semibold max-w-2xl mx-auto">Hear from the modern learners who have redefined their careers through HaxoAcademy.</p>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
                    {testimonials.map((t, idx) => (
                        <div key={idx} className="bg-gray-50 p-10 rounded-[48px] relative group hover:bg-gray-900 hover:text-white transition-all duration-500 animate-fade-up" style={{ animationDelay: `${idx * 200}ms` }}>
                            <div className="absolute top-10 right-10 text-indigo-200 group-hover:text-white/10 transition-colors">
                                <FaQuoteLeft size={40} />
                            </div>
                            <p className="text-lg font-bold mb-10 leading-relaxed italic">"{t.text}"</p>
                            <div className="flex items-center gap-4">
                                <img src={t.avatar} className="w-14 h-14 rounded-2xl object-cover" alt={t.name} />
                                <div className="text-left">
                                    <h4 className="font-bold text-lg">{t.name}</h4>
                                    <p className="text-sm font-semibold text-indigo-500 uppercase tracking-widest group-hover:text-indigo-400">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section >

            {/* FAQ Section */}
            < section id="faq" className="py-32 bg-gray-50/50" >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20 animate-fade-up">
                        <h2 className="text-5xl font-extrabold tracking-tighter text-gray-900">Education Intelligence</h2>
                        <p className="text-gray-500 font-semibold mt-4 uppercase tracking-[0.2em] text-sm">Everything you need to know about admissions</p>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md animate-fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                <button
                                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                    className="w-full p-8 flex justify-between items-center text-left"
                                >
                                    <span className="text-lg font-bold text-gray-900">{faq.q}</span>
                                    <div className={`w-8 h-8 rounded-full border-2 border-gray-100 flex items-center justify-center text-indigo-600 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`}>
                                        {activeFaq === idx ? <FaMinus size={12} /> : <FaPlus size={12} />}
                                    </div>
                                </button>
                                <div className={`px-8 overflow-hidden transition-all duration-500 ease-in-out ${activeFaq === idx ? 'pb-8 opacity-100 max-h-40' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-gray-500 font-semibold leading-relaxed">{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Role CTAs */}
            < section id="features" className="py-32" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Instructor CTA */}
                        <div className="relative group bg-slate-900 rounded-[48px] p-12 overflow-hidden shadow-2xl animate-fade-up">
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150" />
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-20 h-20 bg-indigo-500/20 rounded-3xl flex items-center justify-center text-indigo-400 mb-8 border border-white/10">
                                    <FaChalkboardTeacher size={40} />
                                </div>
                                <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tighter">HaxoAcademy <br />Admissions Portal</h2>
                                <p className="text-indigo-100/70 text-lg font-medium leading-relaxed mb-10 flex-grow">
                                    Apply as a Master Instructor to build high-fidelity interactive curriculums. Join our global mission to standardize skill acquisition.
                                </p>
                                <button onClick={() => navigate('/register')} className="inline-flex items-center gap-3 px-8 py-5 bg-white text-gray-900 rounded-2xl font-bold hover:bg-indigo-400 transition-all w-fit active:scale-95">
                                    Start Teaching <FaArrowRight />
                                </button>
                            </div>
                        </div>

                        {/* Student CTA */}
                        <div className="relative group bg-indigo-600 rounded-[48px] p-12 overflow-hidden shadow-2xl shadow-indigo-500/30 animate-fade-up delay-200">
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150" />
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-white mb-8 border border-white/20">
                                    <FaGraduationCap size={40} />
                                </div>
                                <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tighter">HaxoTech <br />Learning Network</h2>
                                <p className="text-white/80 text-lg font-medium leading-relaxed mb-10 flex-grow">
                                    Accelerate your tech career by joining our elite student community. Secure your spot on the waitlist for upcoming high-intensity bootcamps.
                                </p>
                                <button onClick={() => navigate('/register')} className="inline-flex items-center gap-3 px-8 py-5 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all w-fit shadow-xl active:scale-95">
                                    Join Waitlist <FaArrowRight />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Footer */}
            < footer className="bg-gray-900 text-white pt-32 pb-16" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                                    <FaGraduationCap size={24} />
                                </div>
                                <span className="text-2xl font-extrabold tracking-tighter uppercase">HaxoAcademy</span>
                            </div>
                            <p className="text-gray-400 font-semibold mb-10 leading-relaxed uppercase text-xs tracking-widest">
                                The high-fidelity Learning Management System for the HaxoTech Technologies ecosystem.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-indigo-400 mb-8 uppercase tracking-[0.2em] text-xs">Curriculum</h4>
                            <ul className="space-y-4 text-gray-500 font-semibold text-sm uppercase tracking-widest">
                                <li><Link to="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                                <li><Link to="/register" className="hover:text-white transition-colors">Admissions</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-indigo-400 mb-8 uppercase tracking-[0.2em] text-xs">Platform</h4>
                            <ul className="space-y-4 text-gray-500 font-semibold text-sm uppercase tracking-widest">
                                <li><a href="#" className="hover:text-white transition-colors">HaxoTech</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Tech Stack</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-indigo-400 mb-8 uppercase tracking-[0.2em] text-xs">Stay Connected</h4>
                            <p className="text-sm font-semibold text-gray-500 mb-8">Join the HaxoTech newsletter for curriculum updates.</p>
                            <div className="flex gap-2 p-2 border border-white/10 rounded-2xl bg-white/5 focus-within:border-indigo-600 transition-colors">
                                <input type="email" placeholder="Email address" className="bg-transparent border-none outline-none px-4 flex-grow font-bold text-sm text-white" />
                                <button className="p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all active:scale-95">
                                    <FaArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-6">
                        <p className="text-gray-500 font-semibold text-xs uppercase tracking-[0.2em]">Designed & Developed By HaxoTech Technologies</p>
                        <div className="flex gap-8 text-gray-600 font-semibold text-xs uppercase tracking-widest">
                            <p>© 2026 HaxoAcademy. Global Presence.</p>
                        </div>
                    </div>
                </div>
            </footer >
        </div >
    );
};

export default LandingPage;
