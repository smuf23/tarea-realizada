import { useState, useEffect, useRef } from "react";

export default function TaskList({ tasks, setTasks, users }) {
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [assignedUid, setAssignedUid] = useState("");
  const [durationHours, setDurationHours] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [error, setError] = useState("");
  const [timers, setTimers] = useState({});      // { [taskId]: msRemaining }
  const [notified, setNotified] = useState([]);  // IDs ya notificados
  const timeouts = useRef({});                   // para clearTimeout

  // Pedir permiso para notificaciones al montar
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Configura countdown y notificaciones cada vez que cambian las tasks
  useEffect(() => {
    // Limpiar timeouts anteriores
    Object.values(timeouts.current).forEach(clearTimeout);
    timeouts.current = {};

    const now = Date.now();
    const initial = {};

    tasks.forEach((t) => {
      if (t.endTime) {
        const remaining = t.endTime - now;
        initial[t.id] = remaining > 0 ? remaining : 0;

        // Si no ha sido notificado todavía, programa notificación
        if (remaining > 0 && !notified.includes(t.id)) {
          timeouts.current[t.id] = setTimeout(() => {
            if (Notification.permission === "granted") {
              new Notification("Tarea lista", {
                body: `Es tu turno de: ${t.text}`,
              });
            } else {
              alert(`Es tu turno de: ${t.text}`);
            }
            setNotified((prev) => [...prev, t.id]);
          }, remaining);
        }
      }
    });

    setTimers(initial);
    return () => {
      Object.values(timeouts.current).forEach(clearTimeout);
    };
  }, [tasks, notified]);

  // Intervalo para actualizar los contadores cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTimers((prev) => {
        const next = {};
        Object.entries(prev).forEach(([id]) => {
          const t = tasks.find((x) => x.id === Number(id));
          if (t && t.endTime) {
            const rem = t.endTime - now;
            next[id] = rem > 0 ? rem : 0;
          }
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [tasks]);

  // Formatea milisegundos a HH:MM:SS
  const formatTime = (ms) => {
    const total = Math.floor(ms / 1000);
    const h = String(Math.floor(total / 3600)).padStart(2, "0");
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const addTask = () => {
    if (users.length === 0) {
      setError("Añade primero al menos un participante.");
      return;
    }
    if (!newTask.trim()) {
      setError("La tarea no puede estar vacía.");
      return;
    }
    if (!assignedUid) {
      setError("Selecciona a quién asignar.");
      return;
    }

    const durationMs =
      (durationHours * 60 + durationMinutes) * 60 * 1000;
    const endTime = durationMs > 0 ? Date.now() + durationMs : undefined;

    const item = {
      id: Date.now(),
      text: newTask.trim(),
      assignedUid,
      done: false,
      endTime,
    };
    setTasks([...tasks, item]);
    setNewTask("");
    setAssignedUid("");
    setDurationHours(0);
    setDurationMinutes(0);
    setError("");
  };

  const toggleDone = (id) =>
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  const deleteTask = (id) =>
    setTasks(tasks.filter((t) => t.id !== id));

  const pending = tasks.filter((t) => !t.done);
  const doneList = tasks.filter((t) => t.done);

  return (
    <div>
      <h2
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        Tareas
        <button
          onClick={() => setShowForm((f) => !f)}
          style={{ fontSize: "1.25rem" }}
        >
          +
        </button>
      </h2>

      {showForm && (
        <div style={{ marginBottom: "1rem" }}>
          <input
            placeholder="Nueva tarea"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          <select
            value={assignedUid}
            onChange={(e) => setAssignedUid(e.target.value)}
            style={{ marginRight: "0.5rem" }}
          >
            <option value="">Asignar a…</option>
            {users.map((u) => (
              <option key={u.uid} value={u.uid}>
                {u.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            max="23"
            value={durationHours}
            onChange={(e) =>
              setDurationHours(Number(e.target.value))
            }
            style={{ width: "50px", marginRight: "0.2rem" }}
            title="Horas"
          />{" "}
          H
          <input
            type="number"
            min="0"
            max="59"
            value={durationMinutes}
            onChange={(e) =>
              setDurationMinutes(Number(e.target.value))
            }
            style={{
              width: "50px",
              marginLeft: "0.2rem",
              marginRight: "0.5rem",
            }}
            title="Minutos"
          />{" "}
          Min
          <button onClick={addTask}>Añadir tarea</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}

      <h3>Por hacer</h3>
      {pending.length === 0 ? (
        <p>No hay tareas pendientes.</p>
      ) : (
        <ul>
          {pending.map((t) => {
            const u = users.find((u) => u.uid === t.assignedUid);
            return (
              <li
                key={t.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleDone(t.id)}
                  style={{ marginRight: "0.5rem" }}
                />
                <span style={{ flexGrow: 1 }}>
                  {t.text} — <em>{u?.name || "Desconocido"}</em>
                  {t.endTime &&
                    ` [${formatTime(timers[t.id] || 0)}]`}
                </span>
                <button
                  onClick={() => deleteTask(t.id)}
                  style={{ color: "red" }}
                >
                  🗑️
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <h3>Hechas</h3>
      {doneList.length === 0 ? (
        <p>No hay tareas hechas.</p>
      ) : (
        <ul>
          {doneList.map((t) => {
            const u = users.find((u) => u.uid === t.assignedUid);
            return (
              <li
                key={t.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleDone(t.id)}
                  style={{ marginRight: "0.5rem" }}
                />
                <span
                  style={{
                    textDecoration: "line-through",
                    flexGrow: 1,
                  }}
                >
                  {t.text} — <em>{u?.name || "Desconocido"}</em>
                  {t.endTime &&
                    ` [${formatTime(timers[t.id] || 0)}]`}
                </span>
                <button
                  onClick={() => deleteTask(t.id)}
                  style={{ color: "red" }}
                >
                  🗑️
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}





