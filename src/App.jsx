import React, { useState } from "react";

// Custom hook for localStorage state
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

function TodoApp() {
  const [todos, setTodos] = useLocalStorage("todos", []);
  const [newTodo, setNewTodo] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");

  const addTodo = () => {
    setTodos([...todos, { text: newTodo.trim(), completed: false }]);
    setNewTodo("");
  };

  const toggleTodo = (index) => {
    const updated = [...todos];
    updated[index].completed = !updated[index].completed;
    setTodos(updated);
  };

  const removeTodo = (index) => {
    const updated = [...todos];
    updated.splice(index, 1);
    setTodos(updated);
  };

  const startEditing = (index) => {
    setEditIndex(index);
    setEditText(todos[index].text);
  };

  const saveEdit = (index) => {
    const updated = [...todos];
    updated[index].text = editText.trim();
    setTodos(updated);
    setEditIndex(null);
    setEditText("");
  };

  const clearCompleted = () => {
    const filtered = todos.filter((todo) => !todo.completed);
    setTodos(filtered);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f9f9f9",
      }}
    >
      <div style={{ width: "100%", maxWidth: 500, padding: 20 }}>
        <h2 style={{ textAlign: "center" }}>Todo List</h2>

        <div style={{ display: "flex", marginBottom: 10 }}>
          <input
            type="text"
            placeholder="Tambah todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            style={{ flex: 1, padding: "8px" }}
          />
          <button onClick={addTodo} style={{ marginLeft: 10 }}>
            Add
          </button>
        </div>

        <div style={{ marginBottom: 10, textAlign: "center" }}>
          <button onClick={() => setFilter("all")} disabled={filter === "all"}>
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            disabled={filter === "active"}
            style={{ marginLeft: 5 }}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            disabled={filter === "completed"}
            style={{ marginLeft: 5 }}
          >
            Completed
          </button>
          <button
            onClick={clearCompleted}
            style={{ marginLeft: 20, color: "red" }}
          >
            Clear Completed
          </button>
        </div>

        <ul style={{ padding: 0, listStyle: "none" }}>
          {filteredTodos.map((todo, index) => (
            <li
              key={index}
              style={{
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(index)}
                style={{ marginRight: 10 }}
              />
              {editIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    onClick={() => saveEdit(index)}
                    style={{ marginLeft: 5 }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditIndex(null)}
                    style={{ marginLeft: 5 }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span
                    style={{
                      flex: 1,
                      textDecoration: todo.completed ? "line-through" : "none",
                      color: todo.completed ? "#aaa" : "#000",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleTodo(index)}
                  >
                    {todo.text || <i>(kosong)</i>}
                  </span>
                  <button
                    onClick={() => startEditing(index)}
                    style={{ marginLeft: 5 }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeTodo(index)}
                    style={{ marginLeft: 5, color: "red" }}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p style={{ textAlign: "center", color: "#aaa" }}>Belum ada todo</p>
        )}
      </div>
    </div>
  );
}

export default TodoApp;
