import { useState } from "react";

export default function UserList({ users, setUsers }) {
  const [showControls, setShowControls] = useState(false);
  const [newUser, setNewUser] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingName, setEditingName] = useState("");

  const addUser = () => {
    if (!newUser.trim()) return;
    setUsers([...users, newUser.trim()]);
    setNewUser("");
  };

  const deleteUser = (i) =>
    setUsers(users.filter((_, idx) => idx !== i));

  const startEditing = (i) => {
    setEditingIndex(i);
    setEditingName(users[i]);
  };

  const saveEdit = (i) => {
    if (!editingName.trim()) return;
    const updated = [...users];
    updated[i] = editingName.trim();
    setUsers(updated);
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingName("");
  };

  return (
    <div>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        Participantes
        <button
          onClick={() => setShowControls(!showControls)}
          style={{ fontSize: '1.25rem' }}
        >
          +
        </button>
      </h2>

      {showControls ? (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <input
              placeholder="Nombre del participante"
              value={newUser}
              onChange={e => setNewUser(e.target.value)}
            />
            <button onClick={addUser}>Añadir</button>
          </div>

          <ul>
            {users.map((u, i) => (
              <li key={i} style={{ marginBottom: '0.5rem' }}>
                {editingIndex === i ? (
                  <>
                    <input
                      value={editingName}
                      onChange={e => setEditingName(e.target.value)}
                    />
                    <button onClick={() => saveEdit(i)}>Guardar</button>
                    <button onClick={cancelEdit}>Cancelar</button>
                  </>
                ) : (
                  <>
                    {u}{' '}
                    <button onClick={() => startEditing(i)}>Editar</button>
                    <button onClick={() => deleteUser(i)}>Borrar</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <ul>
          {users.map((u, i) => (
            <li key={i}>{u}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
