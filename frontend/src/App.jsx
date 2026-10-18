import { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  // State management using useState
  const [todos, setTodos] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyIds, setBusyIds] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch todos on component mount using useEffect
  useEffect(() => {
    let isMounted = true;

    async function loadTodos() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/todos`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Server responded with status ${response.status}`);
        }
        const data = await response.json();
        if (isMounted) {
          setTodos(data);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.message || 'Failed to connect to backend server. Make sure it is running on port 5000.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTodos();

    return () => {
      isMounted = false;
    };
  }, []);

  // POST: Create a new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    const trimmedTitle = taskInput.trim();

    // Prevent empty or whitespace-only submissions
    if (!trimmedTitle) {
      setErrorMessage('Please enter a task before clicking Add.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: trimmedTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to create task (Status: ${response.status})`);
      }

      const newTodo = await response.json();
      // Prepend newly created todo returned by backend
      setTodos((prevTodos) => [newTodo, ...prevTodos]);
      setTaskInput('');
    } catch (err) {
      setErrorMessage(err.message || 'Error adding task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // PATCH: Toggle completed status of a todo
  const handleToggleComplete = async (todo) => {
    if (busyIds.includes(todo._id)) return; // Prevent duplicate requests

    setBusyIds((prev) => [...prev, todo._id]);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/todos/${todo._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update status (Status: ${response.status})`);
      }

      const updatedTodo = await response.json();
      // Update UI with the response from backend
      setTodos((prevTodos) =>
        prevTodos.map((item) => (item._id === updatedTodo._id ? updatedTodo : item))
      );
    } catch (err) {
      setErrorMessage(err.message || 'Error updating task status.');
    } finally {
      setBusyIds((prev) => prev.filter((id) => id !== todo._id));
    }
  };

  // DELETE: Delete a todo by its MongoDB ID
  const handleDeleteTodo = async (id) => {
    if (busyIds.includes(id)) return; // Prevent duplicate requests

    setBusyIds((prev) => [...prev, id]);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to delete task (Status: ${response.status})`);
      }

      // Remove from UI state on successful response
      setTodos((prevTodos) => prevTodos.filter((item) => item._id !== id));
    } catch (err) {
      setErrorMessage(err.message || 'Error deleting task.');
    } finally {
      setBusyIds((prev) => prev.filter((busyId) => busyId !== id));
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <main className="app-container">
      {/* Header section */}
      <header className="app-header">
        <div className="header-content">
          <h1>My Todo List</h1>
          <p className="header-subtitle">Stay organized and get things done</p>
        </div>
        {!loading && todos.length > 0 && (
          <div className="stats-badge">
            <span className="stats-number">{completedCount}</span>
            <span className="stats-total">/ {todos.length} done</span>
          </div>
        )}
      </header>

      {/* Error message banner */}
      {errorMessage && (
        <div className="error-banner" role="alert" id="error-message">
          <span className="error-icon">⚠️</span>
          <p className="error-text">{errorMessage}</p>
          <button
            type="button"
            className="error-dismiss-btn"
            onClick={() => setErrorMessage(null)}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Form for adding a new todo */}
      <form className="add-todo-form" onSubmit={handleAddTodo}>
        <input
          id="task-input"
          type="text"
          className="todo-input"
          placeholder="What do you need to do?"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          disabled={isSubmitting}
          autoComplete="off"
        />
        <button
          id="add-task-btn"
          type="submit"
          className="add-btn"
          disabled={isSubmitting || !taskInput.trim()}
        >
          {isSubmitting ? (
            <span className="btn-loading">
              <span className="spinner"></span> Adding...
            </span>
          ) : (
            'Add'
          )}
        </button>
      </form>

      {/* Main Content: Loading, Empty, or Todo List */}
      <section className="todo-section">
        {loading ? (
          <div className="status-state loading-state" id="loading-state">
            <div className="spinner large"></div>
            <p>Loading your tasks...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="status-state empty-state" id="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No tasks yet</h3>
            <p>Add your first task above to get started!</p>
          </div>
        ) : (
          <ul className="todo-list" id="todo-list">
            {todos.map((todo) => {
              const isBusy = busyIds.includes(todo._id);
              return (
                <li
                  key={todo._id}
                  className={`todo-item ${todo.completed ? 'is-completed' : ''} ${isBusy ? 'is-busy' : ''}`}
                >
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      id={`checkbox-${todo._id}`}
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo)}
                      disabled={isBusy}
                      aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                    />
                    <span className="custom-checkmark"></span>
                  </label>

                  <span
                    className={`todo-title ${todo.completed ? 'strikethrough' : ''}`}
                    onClick={() => !isBusy && handleToggleComplete(todo)}
                  >
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    id={`delete-${todo._id}`}
                    className="delete-btn"
                    onClick={() => handleDeleteTodo(todo._id)}
                    disabled={isBusy}
                    aria-label={`Delete task "${todo.title}"`}
                  >
                    {isBusy ? '...' : 'Delete'}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
