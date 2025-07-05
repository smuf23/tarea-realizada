function TaskList({ users, tasks, setTasks }) {
  const [newTask, setNewTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [assignedUser, setAssignedUser] = useState("");

  const addTask = () => {
    const text = newTask.trim();
    if (!text) return alert("La tarea no puede estar vacía");
    if (!assignedUser) return alert("Debes asignar la tarea a un participante");

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text,
        assignedTo: assignedUser,
        completed: false,
      },
    ]);
    setNewTask("");
    setAssignedUser("");
  };

  const startEditing = (task) => {
    setEditTaskId(task.id);
    setEditTaskText(task.text);
    setAssignedUser(task.assignedTo);
  };

  const cancelEditing = () => {
    setEditTaskId(null);
    setEditTaskText("");
    setAssignedUser("");
  };

  const saveEditing = () => {
    if (!editTaskText.trim()) return alert("La tarea no puede estar vacía");
    if (!assignedUser) return alert("Debes asignar la tarea a un participante");

    setTasks(tasks.map(t =>
      t.id === editTaskId
        ? { ...t, text: editTaskText, assignedTo: assignedUser }
        : t
    ));
    cancelEditing();
  };

  const deleteTask = (id) => {
    if (!window.confirm("¿Seguro que quieres borrar esta tarea?")) return;
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t =>
      t.id === id
        ? { ...t, completed: !t.completed }
        : t
    ));
  };

  return (
    <div>
      <h2>Tareas</h2>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Nueva tarea"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <select
          value={assignedUser}
          onChange={e => setAssignedUser(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        >
          <option value="">Asignar a...</option>
          {users.map(u => (
            <option key={u.id} value={u.name}>{u.name}</option>
          ))}
        </select>
        <button onClick={addTask}>Añadir</button>
      </div>

      <ul>
        {tasks.map(task => (
          <li key={task.id} style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task.id)}
              style={{ marginRight: "0.5rem" }}
            />
            {editTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editTaskText}
                  onChange={e => setEditTaskText(e.target.value)}
                  style={{ marginRight: "0.5rem" }}
                />
                <select
                  value={assignedUser}
                  onChange={e => setAssignedUser(e.target.value)}
                  style={{ marginRight: "0.5rem" }}
                >
                  {users.map(u => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
                </select>
                <button onClick={saveEditing} style={{ marginRight: "0.5rem" }}>Guardar</button>
                <button onClick={cancelEditing}>Cancelar</button>
              </>
            ) : (
              <>
                <span style={{ textDecoration: task.completed ? "line-through" : "none", flexGrow: 1 }}>
                  {task.text} - <em>{task.assignedTo}</em>
                </span>
                <button onClick={() => startEditing(task)} style={{ marginRight: "0.5rem" }}>✏️</button>
                <button onClick={() => deleteTask(task.id)} style={{ color: "red" }}>🗑️</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;


