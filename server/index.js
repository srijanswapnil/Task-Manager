const express = require("express");
const cors = require("cors");
const pool = require("./db");
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("./controllers/taskController");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/tasks", getAllTasks);
app.get("/api/tasks/:id", getTaskById);
app.post("/api/tasks", createTask);
app.put("/api/tasks/:id", updateTask);
app.delete("/api/tasks/:id", deleteTask);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
