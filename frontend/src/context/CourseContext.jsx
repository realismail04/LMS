import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tenant, setTenant] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [orders, setOrders] = useState([]);

    const fetchTenant = async () => {
        try {
            const { data } = await api.get('/tenants/current');
            setTenant(data);
            localStorage.setItem('tenant_subdomain', data.subdomain);
            // Apply branding
            if (data.branding) {
                document.documentElement.style.setProperty('--primary-color', data.branding.primaryColor);
                document.documentElement.style.setProperty('--secondary-color', data.branding.secondaryColor);
            }
        } catch (error) {
            console.error("Failed to fetch tenant", error);
        }
    };

    const fetchCourses = async () => {
        try {
            const { data } = await api.get('/courses');
            setCourses(data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEnrollments = async () => {
        try {
            const { data } = await api.get('/enrollments/my');
            setEnrollments(data);
        } catch (error) {
            console.error("Failed to fetch enrollments", error);
        }
    };

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/courses/my/orders');
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        }
    };

    useEffect(() => {
        fetchTenant();
        fetchCourses();
        fetchEnrollments();
        fetchOrders();
    }, []);

    const addCourse = async (courseData) => {
        try {
            const { data } = await api.post('/courses', courseData);
            setCourses([...courses, data]);
            return data;
        } catch (error) {
            console.error("Failed to add course", error);
            throw error;
        }
    };

    const deleteCourse = async (id) => {
        try {
            await api.delete(`/courses/${id}`);
            setCourses(courses.filter(c => c._id !== id));
        } catch (error) {
            console.error("Failed to delete course", error);
        }
    };

    const enrollInCourse = async (courseId) => {
        try {
            const { data } = await api.post('/enrollments', { courseId });
            // Re-fetch all to ensure consistent data structure
            await fetchEnrollments();
            return data;
        } catch (error) {
            console.error("Failed to enroll", error);
            throw error;
        }
    };

    const updateLessonProgress = async (courseId, lessonId) => {
        try {
            const { data } = await api.put(`/enrollments/${courseId}/progress`, { lessonId });

            // Update local state robustly
            setEnrollments(prev => prev.map(enrollment => {
                const currentCourseId = enrollment.course?._id || enrollment.course;
                if (currentCourseId?.toString() === courseId?.toString()) {
                    return { ...enrollment, ...data };
                }
                return enrollment;
            }));
            return data;
        } catch (error) {
            console.error("Failed to update progress", error);
            throw error;
        }
    };

    return (
        <CourseContext.Provider value={{
            courses,
            loading,
            tenant,
            enrollments,
            orders,
            addCourse,
            deleteCourse,
            fetchEnrollments,
            fetchOrders,
            enrollInCourse,
            updateLessonProgress
        }}>
            {children}
        </CourseContext.Provider>
    );
};

export const useCourse = () => useContext(CourseContext);
