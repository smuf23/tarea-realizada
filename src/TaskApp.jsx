import { useState } from "react";
import { useAuth } from "./AuthContext";
import HouseSelector from "./HouseSelector";
import CommunityApp from "./CommunityApp"; // nuevo componente

export default function TaskApp() {
  const { user, logout } = useAuth();
  const [currentHouse, setCurrentHouse] = useState(null);

  if (!currentHouse) {
    return (
      <>
        <header style={{padding:"1rem"}}>
          <h1>¡Hola, {user.email}!</h1>
          <button onClick={logout}>Cerrar sesión</button>
        </header>
        <HouseSelector onSelectHouse={setCurrentHouse} />
      </>
    );
  }

  return (
    <CommunityApp
      house={currentHouse}
      onLeave={() => setCurrentHouse(null)}
    />
  );
}
