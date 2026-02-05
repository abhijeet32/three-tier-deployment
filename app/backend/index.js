require("dotenv").config();
const tasks = require("./routes/tasks");
const auth = require("./routes/auth");
const connection = require("./db");
const cors = require("cors");
const express = require("express");
const app = express();

connection();

app.use(express.json());

// CORS configuration - allow all origins for development/Kubernetes
app.use(cors({
    origin: "*", // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get("/ok", (req, res) => {
    res.status(200).send("ok");
});

app.use("/api/auth", auth);
app.use("/api/tasks", tasks);

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
    console.log(`Listening on port ${port}...`)
});
