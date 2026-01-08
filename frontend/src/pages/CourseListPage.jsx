import { useState } from 'react';
import { useCourse } from '../context/CourseContext';
import { useNavigate } from 'react-router-dom';
import { FaBookmark, FaStar, FaClock, FaChartLine, FaSearch, FaFilter, FaArrowRight, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';
import usePageTitle from '../hooks/usePageTitle';

const CourseListPage = () => {
    usePageTitle('Explore Courses');
    const { courses, loading } = useCourse();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceFilter, setPriceFilter] = useState('All');
    const [levelFilter, setLevelFilter] = useState('All');

    const categories = ['All', ...new Set(courses.map(c => c.category))];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        const matchesPrice = priceFilter === 'All' ||
            (priceFilter === 'Free' && course.price === 0) ||
            (priceFilter === 'Paid' && course.price > 0);
        const matchesLevel = levelFilter === 'All' || course.level === levelFilter.toLowerCase();
        return matchesSearch && matchesCategory && matchesPrice && matchesLevel;
    });

    if (loading) return (
        <div className="p-20 text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="font-black text-gray-400 uppercase tracking-widest text-sm">Synchronizing Curriculum...</p>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto pb-32">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                <div>
                    <span className="text-indigo-600 font-black tracking-widest uppercase text-xs mb-4 block">Knowledge Marketplace</span>
                    <h1 className="text-5xl font-black tracking-tighter text-gray-900 leading-none">Find Your Next Skill</h1>
                </div>
                <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    {['All', 'Free', 'Paid'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPriceFilter(p)}
                            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${priceFilter === p ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
                        >
                            {p}
                        </button>
                    ))}
                    <div className="w-px h-8 bg-gray-100 mx-2" />
                    {['All', 'Beginner', 'Intermediate', 'Advanced'].map(l => (
                        <button
                            key={l}
                            onClick={() => setLevelFilter(l)}
                            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${levelFilter === l ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sticky Controls */}
            <div className="sticky top-24 z-20 bg-white/80 backdrop-blur-xl rounded-[32px] p-6 mb-12 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col lg:flex-row gap-6">
                <div className="flex-grow relative">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="What do you want to learn today?"
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all text-gray-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-4 rounded-2xl font-black text-sm transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
            {filteredCourses.length === 0 ? (
                <div className="py-40 text-center rounded-[60px] border-4 border-dashed border-gray-100 bg-gray-50/30">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl text-gray-200">
                        <FaSearch size={40} />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">No courses found matching your criteria</h3>
                    <p className="text-gray-500 font-bold">Try adjusting your filters or search terms.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredCourses.map(course => (
                        <div
                            key={course._id}
                            onClick={() => navigate(`/courses/${course._id}`)}
                            className="group bg-white rounded-[40px] overflow-hidden border border-gray-100 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-4 cursor-pointer"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img src={course.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={course.title} />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute top-6 left-6 flex gap-2">
                                    <span className="px-5 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black text-gray-900 uppercase tracking-widest shadow-xl">
                                        {course.category}
                                    </span>
                                </div>
                                <button className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600">
                                    <FaBookmark />
                                </button>

                                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <div className="flex items-center gap-2 text-white font-black text-sm">
                                        <FaStar className="text-yellow-400" /> 4.9 (1.2k)
                                    </div>
                                    <div className="flex items-center gap-2 text-white font-black text-sm">
                                        <FaClock /> 12h 30m
                                    </div>
                                </div>
                            </div>

                            <div className="p-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        <FaChartLine /> {course.level || 'Intermediate'}
                                    </div>
                                    <div className={`text-xl font-black ${course.price === 0 ? 'text-green-500' : 'text-indigo-600'} tracking-tighter`}>
                                        {course.price === 0 ? 'FREE' : `$${course.price}`}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors tracking-tight line-clamp-2 leading-none">
                                    {course.title}
                                </h3>
                                <p className="text-gray-500 font-bold mb-8 line-clamp-2 text-sm leading-relaxed">
                                    {course.description}
                                </p>

                                <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 ring-4 ring-gray-50 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/150?u=${course.user}`} alt="Instructor" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-xs font-black text-gray-700 uppercase tracking-widest">Master Instructor</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-45">
                                        <FaArrowRight />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Call to action for Instructors */}
            <div className="mt-32 relative bg-gray-900 rounded-[60px] p-20 overflow-hidden text-center">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />

                <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter leading-none relative z-10">
                    Are you an expert? <br />
                    <span className="text-indigo-400">Share your craft.</span>
                </h2>
                <p className="text-gray-400 font-bold text-lg mb-10 max-w-2xl mx-auto relative z-10">
                    Join our faculty of world-class instructors. Build your curriculum, reach thousands of students, and monetize your expertise.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
                    <button onClick={() => navigate('/register')} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/25 flex items-center gap-3">
                        <FaChalkboardTeacher /> Start Teaching Today
                    </button>
                    <button className="px-10 py-5 bg-white/10 text-white backdrop-blur-md rounded-2xl font-black text-lg hover:bg-white/20 transition-all border border-white/10">
                        View Instructor Guide
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseListPage;
