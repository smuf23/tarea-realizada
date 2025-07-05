// src/App.jsx
import { useAuth } from "./AuthContext";
import Login from "./Login";
import Signup from "./Signup";
import TaskApp from "./TaskApp";

export default function App() {
  const { user } = useAuth();

  // Si no hay usuario autenticado, mostrar pantallas de registro e inicio
  if (!user) {
    return (
      <>
        <Signup />
        <Login />
      </>
    );
  }

  // Si está autenticado, mostrar la aplicación de tareas
  return <TaskApp />;
}
