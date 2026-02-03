import React, { useEffect, useState, useMemo } from "react";
import {
    Paper,
    TextField,
    Checkbox,
    Button,
    Typography,
    IconButton,
    Chip,
    Divider,
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import {
    addTask,
    getTasks,
    updateTask,
    deleteTask,
} from "./services/taskServices";
import { login, signup } from "./services/authServices";
import "./App.css";

const FILTERS = {
    ALL: "all",
    ACTIVE: "active",
    COMPLETED: "completed",
};

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState("");
    const [filter, setFilter] = useState(FILTERS.ALL);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [authMode, setAuthMode] = useState("login"); // 'login' | 'signup'
    const [authEmail, setAuthEmail] = useState(
        localStorage.getItem("authEmail") || ""
    );
    const [authPassword, setAuthPassword] = useState("");
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("authToken")
    );

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        const loadTasks = async () => {
            setLoading(true);
            setError("");
            try {
                const { data } = await getTasks();
                setTasks(data || []);
            } catch (err) {
                console.error(err);
                setError("Unable to load tasks. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, [isAuthenticated]);

    const handleAuthSubmit = async (event) => {
        event.preventDefault();
        if (!authEmail || !authPassword) {
            setAuthError("Email and password are required.");
            return;
        }

        setAuthLoading(true);
        setAuthError("");
        try {
            const action = authMode === "signup" ? signup : login;
            const { data } = await action({
                email: authEmail,
                password: authPassword,
            });

            if (data?.token) {
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("authEmail", data.user?.email || authEmail);
                setIsAuthenticated(true);
                setAuthPassword("");
            } else {
                setAuthError("Unexpected response from server.");
            }
        } catch (err) {
            console.error("Auth error:", err);
            console.error("Error response:", err?.response);
            console.error("Error message:", err?.message);
            
            let message = "Unable to authenticate. Please try again.";
            if (err?.response?.data?.message) {
                message = err.response.data.message;
            } else if (err?.message) {
                message = `Network error: ${err.message}`;
            } else if (err?.code === "ECONNREFUSED" || err?.code === "ERR_NETWORK") {
                message = "Cannot connect to server. Please check if backend is running.";
            }
            setAuthError(message);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authEmail");
        setIsAuthenticated(false);
        setTasks([]);
        setError("");
    };

    const handleChange = (event) => {
        setCurrentTask(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!currentTask.trim()) return;

        const originalTasks = [...tasks];
        setSubmitting(true);
        setError("");
        try {
            const { data } = await addTask({ task: currentTask.trim() });
            setTasks([...originalTasks, data]);
            setCurrentTask("");
        } catch (err) {
            console.error(err);
            setTasks(originalTasks);
            setError("Unable to add task. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleComplete = async (taskId) => {
        const originalTasks = [...tasks];
        const updatedTasks = originalTasks.map((t) =>
            t._id === taskId ? { ...t, completed: !t.completed } : t
        );
        setTasks(updatedTasks);
        setError("");

        const task = updatedTasks.find((t) => t._id === taskId);
        try {
            await updateTask(taskId, { completed: task.completed });
        } catch (err) {
            console.error(err);
            setTasks(originalTasks);
            setError("Unable to update task. Changes were reverted.");
        }
    };

    const handleDelete = async (taskId) => {
        const originalTasks = [...tasks];
        const updatedTasks = originalTasks.filter((t) => t._id !== taskId);
        setTasks(updatedTasks);
        setError("");

        try {
            await deleteTask(taskId);
        } catch (err) {
            console.error(err);
            setTasks(originalTasks);
            setError("Unable to delete task. Please try again.");
        }
    };

    const filteredTasks = useMemo(() => {
        switch (filter) {
            case FILTERS.ACTIVE:
                return tasks.filter((t) => !t.completed);
            case FILTERS.COMPLETED:
                return tasks.filter((t) => t.completed);
            default:
                return tasks;
        }
    }, [tasks, filter]);

    const completedCount = useMemo(
        () => tasks.filter((t) => t.completed).length,
        [tasks]
    );

    return (
        <div className="app">
            <header className="app-header">
                <Typography variant="h4" component="h1" className="app-title">
                    TODO List
                </Typography>
                <Typography variant="subtitle1" className="app-subtitle">
                    Stay organized and keep track of what matters.
                </Typography>
            </header>

            <main className="main-content">
                <Paper elevation={6} className="todo-container">
                    {!isAuthenticated ? (
                        <>
                            <div className="auth-toggle">
                                <Button
                                    size="small"
                                    color={authMode === "login" ? "primary" : "default"}
                                    variant={authMode === "login" ? "contained" : "text"}
                                    onClick={() => setAuthMode("login")}
                                >
                                    Log in
                                </Button>
                                <Button
                                    size="small"
                                    color={authMode === "signup" ? "primary" : "default"}
                                    variant={authMode === "signup" ? "contained" : "text"}
                                    onClick={() => setAuthMode("signup")}
                                >
                                    Sign up
                                </Button>
                            </div>

                            <form onSubmit={handleAuthSubmit} className="auth-form">
                                <TextField
                                    label="Email"
                                    type="email"
                                    variant="outlined"
                                    size="small"
                                    value={authEmail}
                                    onChange={(e) => setAuthEmail(e.target.value)}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    size="small"
                                    value={authPassword}
                                    onChange={(e) => setAuthPassword(e.target.value)}
                                    fullWidth
                                    required
                                />
                                <Button
                                    type="submit"
                                    color="primary"
                                    variant="contained"
                                    disabled={authLoading}
                                >
                                    {authLoading
                                        ? authMode === "signup"
                                            ? "Signing up…"
                                            : "Logging in…"
                                        : authMode === "signup"
                                        ? "Sign up"
                                        : "Log in"}
                                </Button>
                            </form>

                            {authError && (
                                <Typography
                                    variant="body2"
                                    color="error"
                                    className="error-message"
                                >
                                    {authError}
                                </Typography>
                            )}

                            <Divider className="divider" />

                            <Typography variant="body2" className="placeholder">
                                Log in or sign up to manage your to‑dos.
                            </Typography>
                        </>
                    ) : (
                        <>
                            <div className="auth-summary">
                                <Typography variant="body2">
                                    Logged in as <strong>{authEmail}</strong>
                                </Typography>
                                <Button
                                    size="small"
                                    color="default"
                                    onClick={handleLogout}
                                >
                                    Log out
                                </Button>
                            </div>
                    <form onSubmit={handleSubmit} className="task-form">
                        <TextField
                            variant="outlined"
                            size="small"
                            className="task-input"
                            value={currentTask}
                            onChange={handleChange}
                            placeholder="Add a new task…"
                            fullWidth
                        />
                        <Button
                            className="add-task-btn"
                            color="primary"
                            variant="contained"
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? "Adding…" : "Add"}
                        </Button>
                    </form>

                    <div className="toolbar">
                        <div className="filters">
                            <Chip
                                label="All"
                                clickable
                                color={filter === FILTERS.ALL ? "primary" : "default"}
                                onClick={() => setFilter(FILTERS.ALL)}
                                size="small"
                            />
                            <Chip
                                label="Active"
                                clickable
                                color={filter === FILTERS.ACTIVE ? "primary" : "default"}
                                onClick={() => setFilter(FILTERS.ACTIVE)}
                                size="small"
                            />
                            <Chip
                                label="Completed"
                                clickable
                                color={filter === FILTERS.COMPLETED ? "primary" : "default"}
                                onClick={() => setFilter(FILTERS.COMPLETED)}
                                size="small"
                            />
                        </div>
                        <div className="summary">
                            <Typography variant="body2">
                                {completedCount} completed / {tasks.length} total
                            </Typography>
                        </div>
                    </div>

                    <Divider className="divider" />

                    {loading ? (
                        <div className="placeholder">Loading tasks…</div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="placeholder">
                            {filter === FILTERS.ALL
                                ? "No tasks yet. Start by adding one above."
                                : "No tasks match this filter."}
                        </div>
                    ) : (
                        <div className="tasks-list">
                            {filteredTasks.map((task) => (
                                <Paper key={task._id} className="task-item" elevation={1}>
                                    <Checkbox
                                        checked={task.completed}
                                        onChange={() => handleToggleComplete(task._id)}
                                        color="primary"
                                    />
                                    <div
                                        className={
                                            task.completed ? "task-text completed" : "task-text"
                                        }
                                    >
                                        {task.task}
                                    </div>
                                    <IconButton
                                        aria-label="delete task"
                                        onClick={() => handleDelete(task._id)}
                                        className="delete-task-btn"
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Paper>
                            ))}
                        </div>
                    )}

                    {error && (
                        <Typography
                            variant="body2"
                            color="error"
                            className="error-message"
                        >
                            {error}
                        </Typography>
                    )}
                        </>
                    )}
                </Paper>
            </main>
        </div>
    );
};

export default App;