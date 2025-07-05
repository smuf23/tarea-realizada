import { useState } from "react";

export default function TaskList({ tasks, setTasks, users }) {
  const [showControls, setShowControls] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [assignedUser, setAssignedUser] = useState(users[0] || "");

  const addTask = () => {
    if (!newTask.trim() || !assignedUser) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask.trim(),
        assignedTo: assignedUser,
        done: false,
      },
    ]);
    setNewTask("");
    setAssignedUser(users[0] || "");
  };

  const deleteTask = (i) =>
    setTasks(tasks.filter((_, idx) => idx !== i));

  const toggleDone = (i) => {
    setTasks(
      tasks.map((t, idx) =>
        idx === i ? { ...t, done: !t.done } : t
      )
    );
  };

  return (
    <div>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        Tareas
        <button
          onClick={() => setShowControls(!showControls)}
          style={{ fontSize: '1.25rem' }}
        >
          +
        </button>
      </h2>

      <ul>
        {tasks.map((task, i) => (
          <li
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.5rem',
            }}
          >
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleDone(i)}
              style={{ marginRight: '0.5rem' }}
            />
            <span
              style={{
                textDecoration: task.done ? 'line-through' : 'none',
                flexGrow: 1,
              }}
            >
              {task.text} - <em>{task.assignedTo}</em>
            </span>
            {showControls && (
              <button
                onClick={() => deleteTask(i)}
                style={{ marginLeft: '0.5rem', color: 'red' }}
              >
                🗑️
              </button>
            )}
          </li>
        ))}
      </ul>

      {showControls && (
        <div style={{ marginTop: '1rem' }}>
          <input
            placeholder="Nueva tarea"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            style={{ marginRight: '0.5rem' }}
          />
          <select
            value={assignedUser}
            onChange={e => setAssignedUser(e.target.value)}
            style={{ marginRight: '0.5rem' }}
          >
            <option value="">Asignar a...</option>
            {users.map((u, idx) => (
              <option key={idx} value={u}>
                {u}
              </option>
            ))}
          </select>
          <button onClick={addTask}>Añadir</button>
        </div>
      )}
    </div>
  );
}






