import axios from "axios";

const authUrl =
    process.env.REACT_APP_AUTH_URL || "http://localhost:8080/api/auth";

export function signup(credentials) {
    // credentials: { email, password }
    return axios.post(`${authUrl}/signup`, credentials);
}

export function login(credentials) {
    // credentials: { email, password }
    return axios.post(`${authUrl}/login`, credentials);
}


