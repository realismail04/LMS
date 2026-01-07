import { useState } from 'react';
import { useCourse } from '../context/CourseContext';
import { CourseCard } from '../components/DashboardWidgets';
import usePageTitle from '../hooks/usePageTitle';
import { FaSearch, FaFilter } from 'react-icons/fa';

const CoursesPage = () => {
    usePageTitle('Explore Courses');
    const { courses, loading } = useCourse();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Development', 'Design', 'Data Science', 'Business'];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Explore Courses</h1>
                    <p className="text-gray-500 mt-1">Discover new skills and advance your career.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Course Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(n => (
                        <div key={n} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map(course => (
                        <CourseCard
                            key={course._id}
                            id={course._id}
                            title={course.title}
                            instructor={course.instructor}
                            image={course.image}
                            progress={0} // Catalog view doesn't show progress usually, but reusing component
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <FaFilter className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};

export default CoursesPage;
