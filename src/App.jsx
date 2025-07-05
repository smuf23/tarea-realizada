// src/App.jsx
import { useAuth } from "./AuthContext";
import Login from "./Login";
import Signup from "./Signup";
import TaskApp from "./TaskApp";

export default function App() {
  const { user } = useAuth();

  // Si no hay usuario, mostramos registro y login
  if (!user) {
    return (
      <>
        <Signup />
        <Login />
      </>
    );
  }

  // Si hay usuario, mostramos la aplicación de tareas
  return <TaskApp />;
}
