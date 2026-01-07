import { useState } from 'react';
import { useCourse } from '../../context/CourseContext';
import { useNavigate } from 'react-router-dom';
import { FaImage, FaDollarSign, FaTag, FaSave, FaPlus, FaTrash, FaVideo, FaFileAlt, FaQuestionCircle, FaLayerGroup, FaBars } from 'react-icons/fa';
import usePageTitle from '../../hooks/usePageTitle';

const CreateCoursePage = () => {
    usePageTitle('Course Studio');
    const { addCourse } = useCourse();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('settings'); // settings, curriculum

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Development',
        price: '',
        image: '',
        level: 'beginner',
        status: 'published'
    });

    const [modules, setModules] = useState([
        { id: Date.now(), title: 'Introduction', lessons: [] }
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addModule = () => {
        setModules([...modules, { id: Date.now(), title: 'New Module', lessons: [] }]);
    };

    const removeModule = (id) => {
        setModules(modules.filter(m => m.id !== id));
    };

    const updateModuleTitle = (id, title) => {
        setModules(modules.map(m => m.id === id ? { ...m, title } : m));
    };

    const addLesson = (moduleId) => {
        setModules(modules.map(m => m.id === moduleId ? {
            ...m,
            lessons: [...m.lessons, { id: Date.now(), title: 'New Lesson', type: 'video', content: '', videoUrl: '', duration: '5:00' }]
        } : m));
    };

    const updateLesson = (moduleId, lessonId, updates) => {
        setModules(modules.map(m => m.id === moduleId ? {
            ...m,
            lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
        } : m));
    };

    const removeLesson = (moduleId, lessonId) => {
        setModules(modules.map(m => m.id === moduleId ? {
            ...m,
            lessons: m.lessons.filter(l => l.id !== lessonId)
        } : m));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const coursePayload = {
                ...formData,
                modules: modules.map(({ title, lessons }) => ({
                    title,
                    lessons: lessons.map(({ title, type, content, videoUrl, duration }) => ({
                        title, type, content, videoUrl, duration
                    }))
                }))
            };
            await addCourse(coursePayload);
            navigate('/instructor/courses');
        } catch (error) {
            alert("Failed to create course. Please check all fields.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* Studio Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
                        <FaLayerGroup className="mr-3 text-indigo-600" /> Course Studio
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Design your curriculum and configure your course presence.</p>
                </div>

                <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Basic Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('curriculum')}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'curriculum' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Curriculum
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {activeTab === 'settings' ? (
                    <div className="lg:col-span-2 space-y-8 bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <div className="space-y-6">
                            <h3 className="text-xl font-extrabold text-gray-900 border-l-4 border-indigo-600 pl-4">Core Identification</h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Course Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Masterclass in Advanced Logic"
                                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Promotional Description</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows="4"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none font-medium text-gray-600"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-50">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Classification</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-white font-bold"
                                >
                                    <option>Development</option>
                                    <option>Design</option>
                                    <option>Business</option>
                                    <option>Data Science</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Learning Level</label>
                                <select
                                    name="level"
                                    value={formData.level}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-white font-bold"
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="lg:col-span-2 space-y-6">
                        {modules.map((module, mIdx) => (
                            <div key={module.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden animate-slide-in">
                                <div className="bg-gray-50 p-6 flex items-center justify-between">
                                    <div className="flex items-center space-x-4 flex-1">
                                        <div className="bg-indigo-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs">{mIdx + 1}</div>
                                        <input
                                            value={module.title}
                                            onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                                            className="bg-transparent font-extrabold text-gray-800 outline-none border-b-2 border-transparent focus:border-indigo-300 transition-all w-full max-w-md"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeModule(module.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>

                                <div className="p-6 space-y-4">
                                    {module.lessons.map((lesson, lIdx) => (
                                        <div key={lesson.id} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex flex-col gap-4">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="text-gray-300"><FaBars /></div>
                                                    <input
                                                        placeholder="Lesson Title"
                                                        value={lesson.title}
                                                        onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                                                        className="bg-white px-4 py-2 border rounded-xl w-full border-gray-100 font-bold text-sm outline-none focus:border-indigo-400"
                                                    />
                                                </div>
                                                <select
                                                    value={lesson.type}
                                                    onChange={(e) => updateLesson(module.id, lesson.id, { type: e.target.value })}
                                                    className="bg-white px-4 py-2 border rounded-xl text-xs font-bold uppercase tracking-widest border-gray-100 outline-none"
                                                >
                                                    <option value="video">Video</option>
                                                    <option value="text">Article</option>
                                                    <option value="quiz">Quiz</option>
                                                    <option value="assignment">Task</option>
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => removeLesson(module.id, lesson.id)}
                                                    className="text-gray-300 hover:text-red-500"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>

                                            {lesson.type === 'video' ? (
                                                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                                    <input
                                                        placeholder="Video Embed URL (YouTube/Vimeo)"
                                                        value={lesson.videoUrl}
                                                        onChange={(e) => updateLesson(module.id, lesson.id, { videoUrl: e.target.value })}
                                                        className="px-4 py-3 rounded-xl border border-gray-100 text-xs outline-none focus:border-indigo-400"
                                                    />
                                                    <input
                                                        placeholder="Duration (e.g. 12:30)"
                                                        value={lesson.duration}
                                                        onChange={(e) => updateLesson(module.id, lesson.id, { duration: e.target.value })}
                                                        className="px-4 py-3 rounded-xl border border-gray-100 text-xs outline-none focus:border-indigo-400"
                                                    />
                                                </div>
                                            ) : (
                                                <textarea
                                                    placeholder="Educational Content / Markdown Support..."
                                                    value={lesson.content}
                                                    onChange={(e) => updateLesson(module.id, lesson.id, { content: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 text-xs outline-none focus:border-indigo-400 h-24 transition-all"
                                                />
                                            )}
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => addLesson(module.id)}
                                        className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-500 transition-all font-bold text-sm flex items-center justify-center"
                                    >
                                        <FaPlus className="mr-2" /> Add Lesson
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addModule}
                            className="w-full py-6 bg-gray-900/5 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-500 font-bold uppercase text-xs tracking-widest hover:bg-gray-900/10 transition-all flex items-center justify-center p-8"
                        >
                            <FaPlus className="mr-2" /> Insert Module
                        </button>
                    </div>
                )}

                {/* Sidebar Configuration */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Asset & Pricing</h4>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">Display Investment ($)</label>
                            <div className="relative">
                                <FaDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    min="0"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="99.00"
                                    className="w-full pl-10 pr-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">Thumbnail Link</label>
                            <input
                                type="url"
                                name="image"
                                required
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                            />
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transform hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                <FaSave className="text-xl" />
                                {loading ? 'Publishing...' : 'Publish Course'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100">
                        <h5 className="font-bold text-amber-900 text-xs uppercase tracking-widest mb-2">Review Tip:</h5>
                        <p className="text-amber-800/80 text-xs leading-relaxed font-medium">
                            Ensure your curriculum follows a logical progression. Modular courses have a 45% higher completion rate.
                        </p>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default CreateCoursePage;
