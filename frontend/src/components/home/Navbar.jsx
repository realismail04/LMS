import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { Button } from 'antd';

const Navbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4 shadow-sm' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-full">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-all">
                            <FaGraduationCap size={24} />
                        </div>
                        <span className={`text-2xl font-black tracking-tighter uppercase ${isScrolled ? 'bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600' : 'text-white'}`}>
                            HaxoAcademy
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className={`hidden md:flex items-center gap-8 ${isScrolled ? 'text-gray-600' : 'text-white/80'} font-semibold text-sm`}>
                        <a href="#paths" className="hover:text-indigo-400 transition-colors">Paths</a>
                        <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
                        <Link to="/courses" className="hover:text-indigo-400 transition-colors">Marketplace</Link>
                        <Link to="/teachers" className="hover:text-indigo-400 transition-colors">Instructors</Link>
                    </div>

                    <div className="hidden md:flex gap-4 items-center">
                        {user ? (
                            <Link to="/dashboard" className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                                <FaUserCircle size={18} />
                                <span>Hi, {user.name.split(' ')[0]}</span>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className={`text-sm font-semibold hover:text-indigo-400 px-4 ${isScrolled ? 'text-gray-700' : 'text-white'}`}>Log in</Link>
                                <Button
                                    type="primary"
                                    className="!h-10 !px-6 !rounded-full !bg-indigo-600 !border-none !font-bold hover:!scale-105 transition-all !text-sm"
                                    onClick={() => navigate('/register')}
                                >
                                    Start Free
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button className={`md:hidden p-2 ${isScrolled ? 'text-gray-900' : 'text-white'}`} onClick={toggleMenu}>
                        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl py-6 px-4 flex flex-col gap-4">
                    <a href="#paths" onClick={toggleMenu} className="py-2 font-bold text-gray-900">Paths</a>
                    <a href="#features" onClick={toggleMenu} className="py-2 font-bold text-gray-900">Features</a>
                    <Link to="/courses" onClick={toggleMenu} className="py-2 font-bold text-gray-900">Marketplace</Link>
                    <Link to="/teachers" onClick={toggleMenu} className="py-2 font-bold text-gray-900">Instructors</Link>
                    <hr />
                    {user ? (
                        <Link to="/dashboard" onClick={toggleMenu} className="py-3 bg-indigo-600 text-white rounded-xl text-center font-bold">Dashboard</Link>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <Link to="/login" onClick={toggleMenu} className="py-2 text-center font-bold text-gray-500">Log in</Link>
                            <Link to="/register" onClick={toggleMenu} className="py-3 bg-indigo-600 text-white rounded-xl text-center font-bold">Start Free</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
