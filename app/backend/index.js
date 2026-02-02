require("dotenv").config();
const tasks = require("./routes/tasks");
const auth = require("./routes/auth");
const connection = require("./db");
const cors = require("cors");
const express = require("express");
const app = express();

connection();

app.use(express.json());
app.use(cors());

app.get("/ok", (req, res) => {
    res.status(200).send("ok");
});

app.use("/api/auth", auth);
app.use("/api/tasks", tasks);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
