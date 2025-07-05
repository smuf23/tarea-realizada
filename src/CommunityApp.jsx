import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { useAuth } from "./AuthContext";
import UserList from "./UserList";
import TaskList from "./TaskList";

export default function CommunityApp({ house, onLeave }) {
  const { user } = useAuth();
  const [membersInfo, setMembersInfo] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);

  useEffect(() => {
    async function loadMembers() {
      const houseRef = doc(db, "houses", house.id);
      const snap = await getDoc(houseRef);
      if (!snap.exists()) return;
      const data = snap.data();
      setMembersInfo(data.membersInfo || []);
    }
    loadMembers();
  }, [house.id]);

  useEffect(() => {
    async function loadTasks() {
      const tasksRef = collection(db, "houses", house.id, "tasks");
      const snap = await getDocs(tasksRef);
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    loadTasks();
  }, [house.id]);

  // Invitar por correo
  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    try {
      const houseRef = doc(db, "houses", house.id);
      const snap = await getDoc(houseRef);
      const data = snap.data();

      const updatedInvites = data.invitedEmails?.includes(inviteEmail)
        ? data.invitedEmails
        : [...(data.invitedEmails || []), inviteEmail];

      await updateDoc(houseRef, { invitedEmails: updatedInvites });
      setInviteEmail("");
      setInviteError("");
      alert("Invitación enviada!");
      setShowInviteForm(false); // cerrar formulario después de enviar
    } catch (err) {
      console.error(err);
      setInviteError("Error al invitar.");
    }
  };

  return (
    <div style={{ padding: "2rem", position: "relative" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Casa: {house.name}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={() => setShowInviteForm(f => !f)}
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              borderRadius: "50%",
              width: "2.5rem",
              height: "2.5rem",
              cursor: "pointer",
              lineHeight: "2rem",
              padding: 0,
              backgroundColor: "#646cff",
              color: "white",
              border: "none",
            }}
            title="Invitar usuario"
          >
            +
          </button>
          <button onClick={onLeave}>Salir</button>
        </div>
      </header>

      <hr />

      <UserList houseId={house.id} />

      {showInviteForm && (
        <div style={{ margin: "1rem 0" }}>
          <h3>Invitar por correo</h3>
          <input
            type="email"
            placeholder="Correo del invitado"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          <button onClick={handleInvite}>Invitar</button>
          {inviteError && <p style={{ color: "red" }}>{inviteError}</p>}
        </div>
      )}

      <hr />

      <TaskList
        users={membersInfo}
        tasks={tasks}
        setTasks={setTasks}
        houseId={house.id}
      />
    </div>
  );
}
