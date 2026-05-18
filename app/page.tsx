"use client";

import { useState, useEffect } from "react";
import {
  useGetTodos,
  useAddTodo,
  useEditTodo,
  useDeleteTodo,
  Todo,
} from "../api/todo.api";

export default function Home() {
  const { data: todos = [], isLoading, isError, refetch } = useGetTodos();
  const { mutate: addTodo } = useAddTodo();
  const { mutate: editTodo } = useEditTodo();
  const { mutate: deleteTodo } = useDeleteTodo();

  const [newTodoName, setNewTodoName] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);
  

  const [viewingTodo, setViewingTodo] = useState<Todo | null>(null);
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (info) {
      const timer = setTimeout(() => setInfo(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [info]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoName.trim()) return;
    addTodo(newTodoName.trim(), {
      onSuccess: () => {
        setNewTodoName("");
        setInfo("Saved!");
      },
    });
  };

  const handleSaveEdit = () => {
    if (!editingTodo || !editingName.trim()) return;
    editTodo(
      { id: editingTodo.id, name: editingName.trim(), status: editingTodo.status },
      {
        onSuccess: () => {
          setEditingTodo(null);
          setInfo("Updated!");
        },
      }
    );
  };

  const handleDeleteSubmit = () => {
    if (!deletingTodo) return;
    deleteTodo(deletingTodo.id, {
      onSuccess: () => {
        setDeletingTodo(null);
        setInfo("Removed!");
      }
    });
  };

  if (isLoading) return <div style={{ padding: "20px" }}>Loading...</div>;
  if (isError) return <div style={{ padding: "20px" }}><button onClick={() => refetch()}>Retry</button></div>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      
      <div style={{ height: "40px" }}>
        {info && (
          <div style={{ background: "#444", color: "#fff", padding: "8px", borderRadius: "4px", textAlign: "center" }}>
            {info}
          </div>
        )}
      </div>

      <form onSubmit={handleAdd} style={{ display: "flex", gap: "5px", marginBottom: "20px" }}>
        <input
          type="text"
          value={newTodoName}
          onChange={(e) => setNewTodoName(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px" }}>add</button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {todos.map((todo) => (
          <div key={todo.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input 
                type="checkbox" 
                checked={todo.status} 
                onChange={() => {
                  editTodo({ ...todo, status: !todo.status });
                  setInfo("Status changed");
                }} 
              />
              <span style={{ textDecoration: todo.status ? "line-through" : "none" }}>{todo.name}</span>
            </div>
            <div>
              <button onClick={() => setViewingTodo(todo)} style={{ marginRight: "5px", background: "#eee", border: "1px solid #ccc", padding: "5px" }}>Info</button>
              <button onClick={() => { setEditingTodo(todo); setEditingName(todo.name); }} style={{ marginRight: "5px", background: "green", color: "#fff", border: "none", padding: "5px" }}>Edit</button>
              <button onClick={() => setDeletingTodo(todo)} style={{ background: "red", color: "#fff", border: "none", padding: "5px" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

    
      {viewingTodo && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", width: "300px" }}>
            <h4 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>Task Information</h4>
            <p><strong>ID:</strong> {viewingTodo.id}</p>
            <p><strong>Name:</strong> {viewingTodo.name}</p>
            <p><strong>Status:</strong> {viewingTodo.status ? "Completed" : "Active"}</p>
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button onClick={() => setViewingTodo(null)} style={{ padding: "5px 15px" }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {editingTodo && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", width: "280px" }}>
            <h4>Edit task</h4>
            <input type="text" value={editingName} onChange={(e) => setEditingName(e.target.value)} style={{ width: "92%", padding: "8px", marginBottom: "10px" }} />
            <div style={{ textAlign: "right" }}>
              <button onClick={() => setEditingTodo(null)} style={{ marginRight: "5px" }}>Cancel</button>
              <button onClick={handleSaveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {deletingTodo && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", width: "280px" }}>
            <h4>Delete?</h4>
            <p>{deletingTodo.name}</p>
            <div style={{ textAlign: "right" }}>
              <button onClick={() => setDeletingTodo(null)} style={{ marginRight: "5px" }}>No</button>
              <button onClick={handleDeleteSubmit}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}