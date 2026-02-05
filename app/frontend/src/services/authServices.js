import axios from "axios";

const authUrl =
    process.env.REACT_APP_AUTH_URL || "http://127.0.0.1:57847/api/auth";

console.log("Auth URL configured:", authUrl);

export function signup(credentials) {
    // credentials: { email, password }
    const url = `${authUrl}/signup`;
    console.log("Signup request to:", url, "with:", { email: credentials.email });
    return axios.post(url, credentials);
}

export function login(credentials) {
    // credentials: { email, password }
    const url = `${authUrl}/login`;
    console.log("Login request to:", url, "with:", { email: credentials.email });
    return axios.post(url, credentials);
}


