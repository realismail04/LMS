import { useEffect } from 'react';
import { useCourse } from '../context/CourseContext';

const usePageTitle = (title) => {
    const { tenant } = useCourse();

    useEffect(() => {
        const brand = tenant?.name || 'LMS Pro';
        if (title) {
            document.title = `${title} | ${brand}`;
        } else {
            document.title = brand;
        }
    }, [title, tenant]);
};

export default usePageTitle;
