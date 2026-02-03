import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      if (editingId) {
        const task = tasks.find(t => t.id === editingId);
        await axios.put(`${API_URL}/${editingId}`, {
          title,
          description,
          status: task.status
        });
        setEditingId(null);
      } else {
        await axios.post(API_URL, { title, description });
      }
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description || '');
    setEditingId(task.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'pending' ? 'completed' : 'pending';
      await axios.put(`${API_URL}/${task.id}`, {
        ...task,
        status: newStatus
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Task Manager</h1>
        
        <form onSubmit={handleSubmit} className="task-form">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Task description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">
            {editingId ? 'Update Task' : 'Add Task'}
          </button>
          {editingId && (
            <button type="button" onClick={() => {
              setEditingId(null);
              setTitle('');
              setDescription('');
            }}>
              Cancel
            </button>
          )}
        </form>

        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task.id} className={`task-item ${task.status}`}>
              <div className="task-content">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
                <span className="status-badge">{task.status}</span>
              </div>
              <div className="task-actions">
                <button onClick={() => toggleStatus(task)}>
                  {task.status === 'pending' ? '✓ Complete' : '↺ Pending'}
                </button>
                <button onClick={() => handleEdit(task)}>Edit</button>
                <button onClick={() => handleDelete(task.id)} className="delete">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;