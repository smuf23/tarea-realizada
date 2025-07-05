import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export default function UserList({ houseId }) {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchMembers() {
      const snap = await getDoc(doc(db, "houses", houseId));
      if (!snap.exists()) return;
      const data = snap.data();
      const list = data.membersInfo && data.membersInfo.length > 0
        ? data.membersInfo
        : [{ uid: user.uid, email: user.email, usuario: "" }];
      setMembers(list);
    }
    fetchMembers();
  }, [houseId, user.uid, user.email]);

  return (
    <div>
      <h2>Miembros</h2>
      <ul>
        {members.map(u => (
          <li key={u.uid}>
            {u.usuario || u.email} {u.uid === user.uid && <strong>(tú)</strong>}
          </li>
        ))}
      </ul>
    </div>
  );
}

