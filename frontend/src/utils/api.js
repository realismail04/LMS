import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to add the JWT token and Tenant ID to headers
api.interceptors.request.use(
    (config) => {
        // 1. Add Auth Token
        const user = localStorage.getItem('user');
        if (user) {
            const token = JSON.parse(user).token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        // 2. Add Tenant Subdomain
        // Priority: Hostname > LocalStorage > Default 'academy'
        const host = window.location.hostname;
        const parts = host.split('.');
        let subdomain = localStorage.getItem('tenant_subdomain');

        if (parts.length > 2) {
            subdomain = parts[0];
        } else if (!subdomain) {
            subdomain = 'academy'; // Default to acadmey for your demo
        }
        config.headers['X-Tenant-Subdomain'] = subdomain;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
