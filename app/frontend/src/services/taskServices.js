import axios from "axios";

const apiUrl =
    "/api/tasks";
    // process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:57847/api/tasks";

function authConfig() {
    const token = localStorage.getItem("authToken");
    if (!token) return {};
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}

export function getTasks() {
    return axios.get(apiUrl, authConfig());
}

export function addTask(task) {
    return axios.post(apiUrl, task, authConfig());
}

export function updateTask(id, task) {
    return axios.put(`${apiUrl}/${id}`, task, authConfig());
}

export function deleteTask(id) {
    return axios.delete(`${apiUrl}/${id}`, authConfig());
}
