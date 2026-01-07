import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';
import { FaPlayCircle, FaCheckCircle, FaArrowLeft, FaBars } from 'react-icons/fa';
import QuizView from '../components/QuizView';
import AssignmentView from '../components/AssignmentView';
import api from '../utils/api';
import usePageTitle from '../hooks/usePageTitle';

const LessonPage = () => {
    const { courseId } = useParams();
    const { courses, enrollments, enrollInCourse, updateLessonProgress, fetchEnrollments } = useCourse();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Derived State
    const enrollment = enrollments.find(e => (e.course?._id || e.course) === courseId);
    const isEnrolled = !!enrollment;
    const completedLessons = enrollment ? (enrollment.completedLessons || []) : [];

    // Safe fallback for early renders
    const activeLesson = currentLesson || (course?.modules?.[0]?.lessons?.[0]) || (course?.lessons?.[0]);

    usePageTitle(activeLesson?.title || 'Learning');

    useEffect(() => {
        if (courses.length > 0) {
            const currentId = courseId.toString();
            const foundCourse = courses.find(c => c._id.toString() === currentId);
            if (foundCourse) {
                setCourse(foundCourse);

                // Redirect if not enrolled
                const activeEnrollment = enrollments.find(e => (e.course?._id || e.course) === currentId);
                if (!activeEnrollment) {
                    navigate(`/courses/${courseId}`);
                    return;
                }

                const firstLesson = foundCourse.modules?.[0]?.lessons?.[0] || foundCourse.lessons?.[0];
                if (!currentLesson && firstLesson) {
                    setCurrentLesson(firstLesson);
                }
            }
        }
    }, [courseId, courses, currentLesson, enrollments, navigate]);

    // Analytics: Log Lesson View
    useEffect(() => {
        if (activeLesson?._id) {
            api.post('/analytics/log', {
                courseId,
                lessonId: activeLesson._id,
                type: 'view'
            }).catch(err => console.error("Analytics log failed", err));
        }
    }, [activeLesson?._id, courseId]);

    const handleEnroll = async () => {
        try {
            await enrollInCourse(courseId);
            alert("Enrolled successfully!");
            fetchEnrollments(); // Refresh to update isEnrolled
        } catch (error) {
            alert("Failed to enroll");
        }
    };

    const handleMarkComplete = async () => {
        if (!isEnrolled) {
            alert("Please enroll to track progress!");
            return;
        }
        try {
            await updateLessonProgress(courseId, activeLesson._id);
            // Analytics: Log Completion
            api.post('/analytics/log', {
                courseId,
                lessonId: activeLesson._id,
                type: 'completion'
            }).catch(e => console.error("Analytics completion log failed", e));
        } catch (error) {
            alert("Failed to mark complete");
        }
    };

    if (!course || !activeLesson) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-400 font-medium">Loading course content...</p>
            </div>
        );
    }

    const isLessonCompleted = activeLesson ? completedLessons.includes(activeLesson._id) : false;

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Header */}
                <div className="h-16 flex items-center px-6 bg-gray-800 border-b border-gray-700 shadow-md z-10">
                    <button
                        onClick={() => navigate('/courses')}
                        className="mr-4 p-2 rounded-full hover:bg-gray-700 transition-colors"
                        title="Back to Courses"
                    >
                        <FaArrowLeft className="h-5 w-5 text-gray-400 hover:text-white" />
                    </button>
                    <h1 className="text-lg font-bold truncate flex-1">{course.title}</h1>
                    {!isEnrolled && (
                        <button
                            onClick={handleEnroll}
                            className="mr-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold text-sm"
                        >
                            Enroll Now
                        </button>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-700 lg:hidden"
                    >
                        <FaBars />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-gray-900 flex flex-col items-center">
                    {activeLesson.type === 'quiz' ? (
                        <div className="py-10 px-4 w-full flex justify-center">
                            <QuizView
                                courseId={courseId}
                                quizLesson={activeLesson}
                                onComplete={() => {
                                    fetchEnrollments(); // Refresh progress
                                }}
                            />
                        </div>
                    ) : activeLesson.type === 'assignment' ? (
                        <div className="py-10 px-4 w-full flex justify-center">
                            <AssignmentView
                                courseId={courseId}
                                lessonId={activeLesson._id}
                                onComplete={() => {
                                    fetchEnrollments(); // Refresh progress
                                }}
                            />
                        </div>
                    ) : activeLesson.type === 'video' || !activeLesson.type ? (
                        <div className="w-full max-w-6xl aspect-video bg-black shadow-2xl relative">
                            <iframe
                                width="100%"
                                height="100%"
                                src={activeLesson.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                                title={activeLesson.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    ) : (
                        <div className="w-full max-w-4xl p-10 bg-gray-800 rounded-2xl my-8 shadow-xl border border-gray-700">
                            <div className="prose prose-invert lg:prose-xl max-w-none">
                                <h1 className="text-3xl font-bold mb-6">{activeLesson.title}</h1>
                                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {activeLesson.content || "No content provided for this lesson."}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lesson Details */}
                    {activeLesson.type !== 'quiz' && activeLesson.type !== 'assignment' && (
                        <div className="w-full max-w-6xl p-8 space-y-6">
                            <div className="flex items-start justify-between border-b border-gray-800 pb-8">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">{activeLesson.title}</h2>
                                    <p className="text-gray-400 text-sm">
                                        Type: <span className="capitalize text-indigo-400 font-medium">{activeLesson.type || 'video'}</span> • {activeLesson.duration || '0:00'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleMarkComplete}
                                    disabled={isLessonCompleted}
                                    className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center ${isLessonCompleted
                                        ? 'bg-green-600 cursor-default opacity-80'
                                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                                        }`}
                                >
                                    <FaCheckCircle className="mr-2" />
                                    {isLessonCompleted ? 'Completed' : 'Mark Complete'}
                                </button>
                            </div>

                            {activeLesson.resources?.length > 0 && (
                                <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
                                    <h3 className="text-lg font-bold mb-4 flex items-center">
                                        <span className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></span>
                                        Resources
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {activeLesson.resources.map((res, i) => (
                                            <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors border border-gray-700">
                                                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center mr-3 text-indigo-400 font-bold">
                                                    {res.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium">{res.name}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-gray-800 border-l border-gray-700 transition-all duration-300 flex flex-col flex-shrink-0 absolute right-0 top-0 bottom-0 lg:static z-20`}>
                <div className="p-6 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                    <h3 className="font-bold text-gray-200">Course Content</h3>
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Progress</span>
                        <span className="text-xs text-gray-400 font-medium">
                            {completedLessons.length} / {course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || course.lessons?.length || 0}
                        </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-3 overflow-hidden">
                        <div
                            className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(completedLessons.length / (course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || course.lessons?.length || 1)) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {course.modules?.length > 0 ? (
                        course.modules.map((module) => (
                            <div key={module._id} className="border-b border-gray-700/50">
                                <div className="px-4 py-3 bg-gray-900/50 text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
                                    {module.title}
                                    <span className="text-[10px] bg-gray-700 px-1.5 py-0.5 rounded italic opacity-60">Module</span>
                                </div>
                                {module.lessons.map((lesson, idx) => {
                                    const isCompleted = completedLessons.includes(lesson._id);
                                    const isActive = activeLesson?._id === lesson._id;
                                    return (
                                        <button
                                            key={lesson._id}
                                            onClick={() => setCurrentLesson(lesson)}
                                            className={`w-full flex items-center p-4 hover:bg-gray-700/30 transition-colors text-left group ${isActive ? 'bg-indigo-600/10 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}`}
                                        >
                                            <div className="mr-3 flex-shrink-0">
                                                {isCompleted ? (
                                                    <FaCheckCircle className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${isActive ? 'border-indigo-500 text-indigo-400' : 'border-gray-600 text-gray-500'}`}>
                                                        {idx + 1}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-sm font-semibold truncate ${isActive ? 'text-indigo-400' : 'text-gray-300 group-hover:text-white'}`}>
                                                    {lesson.title}
                                                </h4>
                                                <div className="flex items-center mt-1 text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                                                    <span className={`mr-2 ${lesson.type === 'text' ? 'text-blue-400' : 'text-purple-400'}`}>{lesson.type || 'video'}</span>
                                                    <span>{lesson.duration || '0:00'}</span>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    ) : (
                        course.lessons?.map((lesson, index) => {
                            const isCompleted = completedLessons.includes(lesson._id);
                            const isActive = activeLesson?._id === lesson._id;
                            return (
                                <button
                                    key={lesson._id}
                                    onClick={() => setCurrentLesson(lesson)}
                                    className={`w-full flex items-center p-4 border-b border-gray-700/50 hover:bg-gray-700/50 transition-colors text-left group ${isActive ? 'bg-gray-700/80 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}`}
                                >
                                    <div className="mr-4 text-gray-500 flex-shrink-0">
                                        {isCompleted ? <FaCheckCircle className="h-4 w-4 text-green-500" /> : <span className="text-sm font-mono">{index + 1}</span>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                            {lesson.title}
                                        </h4>
                                        <div className="flex items-center mt-1 text-xs text-gray-500">
                                            <FaPlayCircle className="mr-1" />
                                            {lesson.duration}
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default LessonPage;
