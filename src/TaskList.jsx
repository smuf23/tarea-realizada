// src/TaskList.jsx
import { useState } from "react";

export default function TaskList({ tasks, setTasks, users }) {
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [durationHours, setDurationHours] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [error, setError] = useState("");

  const addTask = () => {
    if (users.length === 0) {
      setError("Añade primero al menos un participante.");
      return;
    }
    if (!newTask.trim()) {
      setError("La tarea no puede estar vacía.");
      return;
    }
    if (!assignedUser) {
      setError("Selecciona a quién asignar.");
      return;
    }
    const item = {
      id: Date.now(),
      text: newTask.trim(),
      assignedTo: assignedUser,
      done: false,
      duration: { hours: durationHours, minutes: durationMinutes }
    };
    setTasks([...tasks, item]);
    setNewTask("");
    setAssignedUser("");
    setDurationHours(0);
    setDurationMinutes(0);
    setError("");
  };

  const toggleDone = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const pending = tasks.filter(t => !t.done);
  const doneList = tasks.filter(t => t.done);

  return (
    <div>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        Tareas
        <button
          onClick={() => setShowForm(f => !f)}
          style={{ fontSize: '1.25rem' }}
        >+</button>
      </h2>

      {showForm && (
        <div style={{ marginBottom: '1rem' }}>
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
            <option value="">Asignar a…</option>
            {users.map(u => (
              <option key={u.id} value={u.name}>{u.name}</option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            max="23"
            value={durationHours}
            onChange={e => setDurationHours(Number(e.target.value))}
            style={{ width: '50px', marginRight: '0.2rem' }}
            title="Horas"
          />H
          <input
            type="number"
            min="0"
            max="59"
            value={durationMinutes}
            onChange={e => setDurationMinutes(Number(e.target.value))}
            style={{ width: '50px', marginLeft: '0.2rem', marginRight: '0.5rem' }}
            title="Minutos"
          />Min
          <button onClick={addTask}>Añadir tarea</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}

      <h3>Por hacer</h3>
      {pending.length === 0
        ? <p>No hay tareas pendientes.</p>
        : (
          <ul>
            {pending.map(t => (
              <li key={t.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleDone(t.id)}
                  style={{ marginRight: '0.5rem' }}
                />
                <span style={{ flexGrow: 1 }}>
                  {t.text} — <em>{t.assignedTo}</em>
                  {t.duration?.hours != null && t.duration?.minutes != null && (
                    <> [{t.duration.hours}H {t.duration.minutes}Min]</>
                  )}
                </span>
                <button onClick={() => deleteTask(t.id)} style={{ color: 'red' }}>🗑️</button>
              </li>
            ))}
          </ul>
        )
      }

      <h3>Hechas</h3>
      {doneList.length === 0
        ? <p>No hay tareas hechas.</p>
        : (
          <ul>
            {doneList.map(t => (
              <li key={t.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleDone(t.id)}
                  style={{ marginRight: '0.5rem' }}
                />
                <span style={{ textDecoration: 'line-through', flexGrow: 1 }}>
                  {t.text} — <em>{t.assignedTo}</em>
                  {t.duration?.hours != null && t.duration?.minutes != null && (
                    <> [{t.duration.hours}H {t.duration.minutes}Min]</>
                  )}
                </span>
                <button onClick={() => deleteTask(t.id)} style={{ color: 'red' }}>🗑️</button>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}






