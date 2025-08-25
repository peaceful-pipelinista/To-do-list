const express = require("express");
const app = express();

app.use(express.static("public")); // serve static files like CSS from public folder
app.set("view engine", "ejs"); // set ejs as the template engine
app.use(express.urlencoded({ extended: true })); // parse form data

let todos = []; // array to store all tasks

// home page shows all todos, default filter is All
app.get("/", (req, res) => {
  res.render("list", { todos, selectedPriority: "All" });
});

// add new task
app.post("/add", (req, res) => {
  const { taskText, priority } = req.body;
  if (!taskText.trim()) {
    return res.send("<h2>Task cannot be empty! <a href='/'>Go back</a></h2>");
  }
  todos.push({ text: taskText, priority });
  res.redirect("/");
});

// delete a task by id
app.post("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  todos.splice(id, 1);
  res.redirect("/");
});

// filter tasks by priority
app.post("/filter", (req, res) => {
  const selectedPriority = req.body.filterPriority;
  let filteredTodos = todos;
  if (selectedPriority !== "All") {
    filteredTodos = todos.filter((todo) => todo.priority === selectedPriority);
  }
  res.render("list", { todos: filteredTodos, selectedPriority });
});

// show edit page for a task
app.get("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos[id];
  if (!todo)
    return res.send("<h2>Task not found! <a href='/'>Go back</a></h2>");
  res.render("edit", { todo, id });
});

// update task with new data
app.post("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { taskText, priority } = req.body;
  todos[id] = { text: taskText, priority };
  res.redirect("/");
});

// start server on port 8000
app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
