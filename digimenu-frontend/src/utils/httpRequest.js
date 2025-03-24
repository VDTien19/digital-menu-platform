import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Xử lý với Http Only Cookie
// const httpRequest = axios.create({
//     baseURL: apiUrl,
//     withCredentials: true, // Cho phép gửi Cookie
// });

// httpRequest.interceptors.use(
//     (config) => {
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     },
// )

const httpRequest = axios.create({
    baseURL: apiUrl,
});

// Interceptors
httpRequest.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export const get = async (path, options = {}) => {
    const respone = await httpRequest.get(path, options);
    return respone.data;
}

export const post = async (path, body = {}, options = {}) => {
    const respone = await httpRequest.post(path, body, options);
    return respone.data;
}

export const put = async (path, body = {}, options = {}) => {
    const respone = await httpRequest.put(path, body, options);
    return respone.data;
}

export const patch = async (path, body = {}, options = {}) => {
    const respone = await httpRequest.patch(path, body, options);
    return respone.data;
};

export const deleted = async (path, body = {}, options = {}) => {
    const respone = await httpRequest.delete(path, body, options);
    return respone.data;
};

export default httpRequest;