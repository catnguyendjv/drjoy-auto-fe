import axios from 'axios';

// Create an axios instance that points to our own API proxy
const redmineApi = axios.create({
    baseURL: '/api/redmine',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default redmineApi;
