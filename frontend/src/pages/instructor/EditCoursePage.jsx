import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useCourse } from '../../context/CourseContext';
import { FaSave, FaArrowLeft, FaPlus, FaTrash, FaVideo, FaFileAlt, FaChartLine } from 'react-icons/fa';
import usePageTitle from '../../hooks/usePageTitle';

const EditCoursePage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { updateCourse } = useCourse();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: '',
        description: '',
        category: 'Development',
        price: 0,
        level: 'beginner',
        image: '',
        modules: []
    });

    usePageTitle(`Edit: ${form.title}`);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await api.get(`/courses/${courseId}`);
                setForm(data);
            } catch (error) {
                console.error("Failed to fetch course", error);
                alert("Course not found");
                navigate('/instructor/courses');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId, navigate]);

    const handleSave = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!form.title.trim()) {
            alert("Course title is required");
            return;
        }
        if (form.price < 0) {
            alert("Price cannot be negative");
            return;
        }

        setSaving(true);
        try {
            await api.put(`/courses/${courseId}`, form);
            alert("Course updated successfully!");
            navigate('/instructor/courses');
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update course");
        } finally {
            setSaving(false);
        }
    };

    const addModule = () => {
        setForm({
            ...form,
            modules: [...form.modules, { title: 'New Module', lessons: [] }]
        });
    };

    const addLesson = (moduleIdx, type) => {
        const newModules = [...form.modules];
        const newLesson = {
            title: 'New Lesson',
            type,
            duration: '10:00',
            videoUrl: type === 'video' ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : '',
            content: type === 'text' ? 'Lesson content goes here...' : ''
        };
        newModules[moduleIdx].lessons.push(newLesson);
        setForm({ ...form, modules: newModules });
    };

    if (loading) return <div className="p-20 text-center font-bold">Loading editor...</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-12">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 font-bold hover:text-gray-900 transition-colors">
                    <FaArrowLeft /> Back
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 flex items-center gap-2 transition-all active:scale-95"
                    >
                        {saving ? 'Saving...' : <><FaSave /> Save Changes</>}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-12">
                {/* Visual Settings */}
                <div className="bg-white rounded-3xl p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <h2 className="text-2xl font-extrabold mb-8 tracking-tighter">Core Identity</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Course Title</label>
                                <input
                                    type="text"
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-900 outline-none focus:ring-2 focus:ring-indigo-600/20"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                <select
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-900"
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                >
                                    <option>Development</option>
                                    <option>Design</option>
                                    <option>Marketing</option>
                                    <option>Business</option>
                                    <option>Engineering</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Price ($)</label>
                                <input
                                    type="number"
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-900"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Level</label>
                                <select
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-900"
                                    value={form.level}
                                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Curriculum Editor */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-4">
                        <h2 className="text-3xl font-extrabold tracking-tighter text-gray-900">Curriculum Studio</h2>
                        <button
                            type="button"
                            onClick={addModule}
                            className="text-indigo-600 font-bold flex items-center gap-2 hover:bg-white px-4 py-2 rounded-xl transition-colors"
                        >
                            <FaPlus /> Add Module
                        </button>
                    </div>

                    {form.modules.map((module, mIdx) => (
                        <div key={mIdx} className="bg-white rounded-[40px] p-8 shadow-xl shadow-gray-200/50 border-2 border-indigo-50">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold">
                                    {mIdx + 1}
                                </div>
                                <input
                                    type="text"
                                    className="flex-grow text-2xl font-extrabold tracking-tight border-none focus:ring-0 outline-none p-0"
                                    value={module.title}
                                    onChange={(e) => {
                                        const newModules = [...form.modules];
                                        newModules[mIdx].title = e.target.value;
                                        setForm({ ...form, modules: newModules });
                                    }}
                                />
                                <button type="button" className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                    <FaTrash />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {module.lessons.map((lesson, lIdx) => (
                                    <div key={lIdx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                                        <div className="text-gray-400">
                                            {lesson.type === 'video' ? <FaVideo /> : lesson.type === 'quiz' ? <FaChartLine /> : <FaFileAlt />}
                                        </div>
                                        <input
                                            type="text"
                                            className="flex-grow bg-transparent border-none font-bold text-gray-900 p-0 focus:ring-0"
                                            value={lesson.title}
                                            onChange={(e) => {
                                                const nm = [...form.modules];
                                                nm[mIdx].lessons[lIdx].title = e.target.value;
                                                setForm({ ...form, modules: nm });
                                            }}
                                        />
                                        <span className="text-[10px] font-bold uppercase text-gray-300 tracking-widest">{lesson.type}</span>
                                    </div>
                                ))}
                                <div className="flex gap-2 pt-4">
                                    <button type="button" onClick={() => addLesson(mIdx, 'video')} className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2">
                                        <FaVideo /> + Video
                                    </button>
                                    <button type="button" onClick={() => addLesson(mIdx, 'text')} className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2">
                                        <FaFileAlt /> + Text
                                    </button>
                                    <button type="button" onClick={() => addLesson(mIdx, 'quiz')} className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2">
                                        <FaChartLine /> + Quiz
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </form>
        </div>
    );
};

export default EditCoursePage;
