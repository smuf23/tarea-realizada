import UserList from "./UserList";
import TaskList from "./TaskList";
import { useAuth } from "./AuthContext";

export default function TaskApp() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "2rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>¡Hola, {user.email}!</h1>
        <button onClick={logout}>Cerrar sesión</button>
      </header>

      <hr style={{ margin: "1.5rem 0" }} />
      {/* Aquí van tus listas de usuarios y tareas */}
      <UserList />
      <hr style={{ margin: "1.5rem 0" }} />
      <TaskList />
    </div>
  );
}
