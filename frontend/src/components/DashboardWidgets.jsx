import { FaChartBar, FaUserFriends, FaBookOpen } from 'react-icons/fa';

export const StatCard = ({ title, value, icon, color }) => {
    const colorClasses = {
        indigo: 'bg-indigo-50 text-indigo-600',
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        pink: 'bg-pink-50 text-pink-600',
    };

    return (
        <div className="bg-white overflow-hidden rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className={`rounded-xl p-3 ${colorClasses[color] || colorClasses.indigo}`}>
                            {icon}
                        </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                            <dd>
                                <div className="text-2xl font-bold text-gray-900">{value}</div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            {/* Decorative bottom bar */}
            <div className={`h-1 w-full bg-${color}-500 opacity-20`} />
        </div>
    );
};

import { Link } from 'react-router-dom';

// ... StatCard ...

export const CourseCard = ({ id, title, progress, image, instructor }) => {
    return (
        <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <Link to={`/course/${id}/learn`} className="block">
                <div className="relative h-48 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <img
                        src={image || "https://images.unsplash.com/photo-1541462608143-df93b7409656?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"}
                        alt={title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute bottom-4 left-4 z-20">
                        <span className="px-2 py-1 text-xs font-semibold bg-indigo-600 text-white rounded-md">
                            {progress > 0 ? 'In Progress' : 'Start Course'}
                        </span>
                    </div>
                </div>
                <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">by {instructor}</p>

                    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
                        <div
                            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 font-medium">
                        <span>{progress}% Completed</span>
                        <span className="text-indigo-600 group-hover:underline">Resume Learning</span>
                    </div>
                </div>
            </Link>
        </div>
    );
};
