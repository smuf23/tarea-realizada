// src/CommunityApp.jsx
import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import UserList from "./UserList";
import TaskList from "./TaskList";

export default function CommunityApp({ house, onLeave }) {
  const [membersInfo, setMembersInfo] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Carga el array membersInfo que está en el documento de la casa
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

  // Carga las tareas de la subcolección houses/{house.id}/tasks
  useEffect(() => {
    async function loadTasks() {
      const tasksRef = collection(db, "houses", house.id, "tasks");
      const snap = await getDocs(tasksRef);
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    loadTasks();
  }, [house.id]);

  return (
    <div style={{ padding: "2rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Casa: {house.name}</h2>
        <button onClick={onLeave}>Salir</button>
      </header>

      <hr />

      {/* Aquí el usuario puede editar su nickname, y ve a los demás */}
      <UserList houseId={house.id} />

      <hr />

      {/* Aquí la lista de tareas compartidas en la casa */}
      <TaskList
        users={membersInfo}
        tasks={tasks}
        setTasks={setTasks}
        houseId={house.id}
      />
    </div>
  );
}
