import { useState } from "react";
import UserList from "./UserList";
import TaskList from "./TaskList";

export default function App() {
  const [users, setUsers] = useState(["Alejandro", "Nazareth"]);
  const [tasks, setTasks] = useState([]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Casa: SmufulHausse</h1>
      <UserList users={users} setUsers={setUsers} />
      <hr style={{ margin: "2rem 0" }} />
      <TaskList users={users} tasks={tasks} setTasks={setTasks} />
    </div>
  );
}
