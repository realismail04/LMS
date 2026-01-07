import { useCourse } from '../../context/CourseContext';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaBook, FaEye } from 'react-icons/fa';
import usePageTitle from '../../hooks/usePageTitle';

const ManageCoursesPage = () => {
    usePageTitle('Manage Courses');
    const { courses, deleteCourse, loading } = useCourse();

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tighter uppercase italic">Inventory Management</h1>
                    <p className="text-gray-500 mt-1 font-bold uppercase tracking-widest text-[10px]">Create, edit, and organize your curriculum library.</p>
                </div>
                <Link
                    to="/instructor/create-course"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center"
                >
                    <FaPlus className="mr-2" /> New Course
                </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-500">Loading courses...</p>
                    </div>
                ) : courses.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 tracking-wider">Course Info</th>
                                    <th className="px-6 py-4 tracking-wider">Students</th>
                                    <th className="px-6 py-4 tracking-wider">Status</th>
                                    <th className="px-6 py-4 tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {courses.map((course) => (
                                    <tr key={course._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-12 w-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    {course.image ? (
                                                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300">
                                                            <FaBook />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-extrabold text-gray-900 leading-tight uppercase tracking-tight">{course.title}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{course.modules?.length || 0} Modules Integrated</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center text-xs font-bold text-gray-700 uppercase tracking-widest">
                                                {Math.floor(Math.random() * 50)} <span className="text-gray-400 font-medium ml-2">Enrolled</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-flex px-4 py-1.5 rounded-full text-[10px] font-bold bg-green-50 text-green-600 uppercase tracking-widest border border-green-100">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right space-x-2">
                                            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center" title="View Course">
                                                <FaEye />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center" title="Edit Course">
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => deleteCourse(course._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center"
                                                title="Delete Course"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-20 px-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 text-indigo-200 mb-6">
                            <FaPlus className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No courses yet</h3>
                        <p className="text-gray-500 mt-2 max-w-sm mx-auto">Click the button above to create your first course and start sharing your knowledge.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCoursesPage;
