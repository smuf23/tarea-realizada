import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { useAuth } from "./AuthContext";

export default function HouseSelector({ onSelectHouse }) {
  const { user } = useAuth();
  const [houses, setHouses] = useState([]);
  const [invited, setInvited] = useState([]);
  const [newHouseName, setNewHouseName] = useState("");
  const [loading, setLoading] = useState(true);

  // Carga casas donde eres miembro y donde estás invitado
  useEffect(() => {
    async function fetchHouses() {
      setLoading(true);
      // Casas como miembro
      const memberQ = query(
        collection(db, "houses"),
        where("members", "array-contains", user.uid)
      );
      // Casas donde está tu email invitado
      const invitedQ = query(
        collection(db, "houses"),
        where("invitedEmails", "array-contains", user.email)
      );
      const [memSnap, invSnap] = await Promise.all([
        getDocs(memberQ),
        getDocs(invitedQ),
      ]);

      const mem = memSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const inv = invSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setHouses(mem);
      setInvited(inv);
      setLoading(false);
    }
    fetchHouses();
  }, [user.uid, user.email]);

  // Crear nueva casa
  const createHouse = async () => {
    if (!newHouseName.trim()) return;
    const ref = await addDoc(collection(db, "houses"), {
      name: newHouseName.trim(),
      ownerUid: user.uid,
      members: [user.uid],
      invitedEmails: [],
    });
    onSelectHouse({ id: ref.id, name: newHouseName.trim() });
  };

  // Unirse a casa invitado
  const joinHouse = async (house) => {
    const hDoc = doc(db, "houses", house.id);
    await updateDoc(hDoc, {
      members: [...house.members, user.uid],
      invitedEmails: house.invitedEmails.filter(e => e !== user.email),
    });
    onSelectHouse(house);
  };

  if (loading) return <p>Cargando casas…</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Mis casas</h2>
      {houses.length === 0 && <p>No perteneces a ninguna casa aún.</p>}
      <ul>
        {houses.map(h => (
          <li key={h.id}>
            {h.name}{" "}
            <button onClick={() => onSelectHouse(h)}>Entrar</button>
          </li>
        ))}
      </ul>

      {invited.length > 0 && (
        <>
          <h3>Invitaciones</h3>
          <ul>
            {invited.map(h => (
              <li key={h.id}>
                {h.name}{" "}
                <button onClick={() => joinHouse(h)}>Unirme</button>
              </li>
            ))}
          </ul>
        </>
      )}

      <hr style={{ margin: "1rem 0" }} />

      <h3>Crear nueva casa</h3>
      <input
        placeholder="Nombre de la casa"
        value={newHouseName}
        onChange={e => setNewHouseName(e.target.value)}
        style={{ marginRight: "0.5rem" }}
      />
      <button onClick={createHouse}>Crear</button>
    </div>
  );
}
