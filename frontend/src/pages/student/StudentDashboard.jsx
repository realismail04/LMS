import { useEffect } from 'react';
import { FaPlay, FaClock, FaCheckCircle, FaStar } from 'react-icons/fa';
import { StatCard, CourseCard } from '../../components/DashboardWidgets';
import usePageTitle from '../../hooks/usePageTitle';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';

const StudentDashboard = () => {
    usePageTitle('Dashboard');
    const { user } = useAuth();

    const { enrollments, fetchEnrollments } = useCourse();

    useEffect(() => {
        fetchEnrollments();
    }, []);

    // Filter enrollments to display
    const myCourses = enrollments.map(enrollment => ({
        _id: enrollment.course._id,
        title: enrollment.course.title,
        instructor: "Instructor", // Backend doesn't populate instructor name fully yet, just ID. 
        image: enrollment.course.image,
        progress: enrollment.progress
    }));

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="relative overflow-hidden rounded-3xl bg-indigo-600 text-white shadow-xl">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 rounded-full bg-white opacity-10"></div>
                <div className="relative p-8 sm:p-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight uppercase italic text-white">
                                Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
                            </h2>
                            <p className="mt-2 text-indigo-100 text-lg max-w-xl font-bold uppercase tracking-widest text-[10px]">
                                You've completed <span className="text-white underline decoration-white/30 decoration-2 underline-offset-4">4 lessons</span> this week. Momentum is high.
                            </p>
                            <div className="mt-6">
                                <button className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-xl hover:bg-gray-50 transition-all transform active:scale-95 uppercase tracking-widest text-xs">
                                    Resume Learning Flow
                                </button>
                            </div>
                        </div>
                        {/* Right side illustration or stat could go here */}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Courses in Progress"
                    value="3"
                    icon={<FaPlay className="h-6 w-6" />}
                    color="indigo"
                />
                <StatCard
                    title="Completed Courses"
                    value="12"
                    icon={<FaCheckCircle className="h-6 w-6" />}
                    color="green"
                />
                <StatCard
                    title="Hours Spent"
                    value="48.5"
                    icon={<FaClock className="h-6 w-6" />}
                    color="blue"
                />
                <StatCard
                    title="Certificates"
                    value="5"
                    icon={<FaStar className="h-6 w-6" />}
                    color="purple"
                />
            </div>

            {/* Continue Learning */}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-extrabold text-gray-900 tracking-tighter uppercase italic">Continue Learning</h3>
                    <a href="#" className="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:text-indigo-700 transition-colors border-b-2 border-transparent hover:border-indigo-600">View Catalog</a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myCourses.length > 0 ? (
                        myCourses.map(course => (
                            <CourseCard
                                key={course._id}
                                id={course._id}
                                title={course.title}
                                instructor={course.instructor}
                                image={course.image}
                                progress={course.progress}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 col-span-3">You are not enrolled in any courses yet. Go to the "Courses" page to enroll!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
