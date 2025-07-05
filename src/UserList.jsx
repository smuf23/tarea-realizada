import { useState } from "react";

export default function UserList({ users, setUsers }) {
  const [showControls, setShowControls] = useState(false);
  const [newUser, setNewUser] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingName, setEditingName] = useState("");

  const addUser = () => {
    if (!newUser.trim()) return;
    setUsers([...users, { id: Date.now(), name: newUser.trim() }]);
    setNewUser("");
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const startEditing = (id) => {
    const user = users.find(u => u.id === id);
    setEditingIndex(id);
    setEditingName(user.name);
  };

  const saveEdit = (id) => {
    if (!editingName.trim()) return;
    setUsers(users.map(u => u.id === id ? { ...u, name: editingName.trim() } : u));
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
          onClick={() => setShowControls(c => !c)}
          style={{ fontSize: '1.25rem' }}
        >+</button>
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
            {users.map(u => (
              <li key={u.id} style={{ marginBottom: '0.5rem' }}>
                {editingIndex === u.id ? (
                  <>
                    <input
                      value={editingName}
                      onChange={e => setEditingName(e.target.value)}
                    />
                    <button onClick={() => saveEdit(u.id)}>Guardar</button>
                    <button onClick={cancelEdit}>Cancelar</button>
                  </>
                ) : (
                  <>
                    {u.name}{" "}
                    <button onClick={() => startEditing(u.id)}>Editar</button>
                    <button onClick={() => deleteUser(u.id)}>Borrar</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <ul>
          {users.map(u => (
            <li key={u.id}>{u.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
