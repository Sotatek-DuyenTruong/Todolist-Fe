"use client";

import { useState } from "react";
import {
  useListTodos,
  useAddTodo,
  useUpdateTodo,
  useDeleteTodo,
} from "../queries/todos";

type Todo = {
  id: string;
  title: string;
};

export default function Page() {
  const listTodos = useListTodos();
  const addTodo = useAddTodo();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const todos: Todo[] = listTodos.data ?? [];

  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleAdd = () => {
    const text = input.trim();
    if (!text) return;
    addTodo.mutate(text);
    setInput("");
  };

  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.title);
  };

  const handleConfirmEdit = () => {
    const text = editingText.trim();
    if (!text || editingId === null) {
      setEditingId(null);
      return;
    }
    updateTodo.mutate({
      id: editingId,
      title: text,
      completed: false,
      createdAt: new Date().toISOString(),
    });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    deleteTodo.mutate(id);
    if (editingId === id) setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <main className="mx-auto max-w-md rounded-xl border-2 border-gray-900 bg-white p-6">
        <h1 className="mb-4 text-xl font-semibold text-gray-900">Todo List</h1>

        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            placeholder="Add a new task"
            className="flex-1 rounded-full border-2 border-gray-900 px-4 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={handleAdd}
            className="rounded-full border-2 border-gray-900 px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Add
          </button>
        </div>

        <ul className="flex flex-col gap-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between gap-3"
            >
              {editingId === todo.id ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleConfirmEdit();
                  }}
                  autoFocus
                  className="flex-1 rounded-md border border-gray-400 px-2 py-1 text-sm focus:outline-none"
                />
              ) : (
                <span className="text-gray-900">{todo.title}</span>
              )}

              <div className="flex gap-3 text-sm">
                {editingId === todo.id ? (
                  <button
                    onClick={handleConfirmEdit}
                    className="text-green-600 hover:underline"
                  >
                    save
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartEdit(todo)}
                    className="text-blue-600 hover:underline"
                  >
                    update
                  </button>
                )}
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="text-red-600 hover:underline"
                >
                  delete
                </button>
              </div>
            </li>
          ))}
          {todos.length === 0 && (
            <li className="text-sm text-gray-400">No tasks yet.</li>
          )}
        </ul>
      </main>
    </div>
  );
}
