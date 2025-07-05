// src/UserList.jsx
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export default function UserList({ houseId }) {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [nickname, setNickname] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  // Carga miembros y nickname inicial
  useEffect(() => {
    async function fetchMembers() {
      const snap = await getDoc(doc(db, "houses", houseId));
      if (!snap.exists()) return;
      const data = snap.data();
      const list = data.membersInfo && data.membersInfo.length > 0
        ? data.membersInfo
        : [{ uid: user.uid, email: user.email, nickname: "" }];
      setMembers(list);
      const me = list.find(u => u.uid === user.uid);
      if (me) setNickname(me.nickname || "");
    }
    fetchMembers();
  }, [houseId, user.uid, user.email]);

  // Guarda el nickname y sale del modo edición
  const saveNickname = async () => {
    if (!nickname.trim()) {
      setError("El nickname no puede estar vacío.");
      return;
    }
    try {
      const updated = members.map(u =>
        u.uid === user.uid ? { ...u, nickname: nickname.trim() } : u
      );
      await updateDoc(doc(db, "houses", houseId), { membersInfo: updated });
      setMembers(updated);
      setEditing(false);
      setError("");
    } catch {
      setError("Error guardando nickname.");
    }
  };

  return (
    <div>
      <h2>Miembros</h2>
      <ul>
        {members.map(u => (
          <li key={u.uid}>
            {u.nickname || u.email} {u.uid === user.uid && <strong>(tú)</strong>}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "1rem" }}>
        <h3>Tu nickname</h3>
        {!editing && nickname ? (
          <>
            <span style={{ marginRight: "0.5rem" }}>{nickname}</span>
            <button onClick={() => setEditing(true)}>+</button>
          </>
        ) : (
          <>
            <input
              placeholder="Pon tu nickname"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              style={{ marginRight: "0.5rem" }}
            />
            <button onClick={saveNickname}>Guardar</button>
          </>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
