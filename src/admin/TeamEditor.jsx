import { useState, useEffect } from "react";

const defaultTeam = [
  {
    id: 1,
    name: "Ricque Roberts",
    role: "Owner & Master Stylist",
    photo: "/assets/ricque.jpg",
  },
];

export default function TeamEditor() {
  const [team, setTeam] = useState([]);
  const [newMember, setNewMember] = useState({ name: "", role: "", photo: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("teamMembers");
    if (saved) {
      setTeam(JSON.parse(saved));
    } else {
      setTeam(defaultTeam);
    }
  }, []);

  function saveTeam(updatedTeam) {
    setTeam(updatedTeam);
    localStorage.setItem("teamMembers", JSON.stringify(updatedTeam));
    setMessage("Team updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  }

  function handleChange(id, field, value) {
    const updated = team.map((member) =>
      member.id === id ? { ...member, [field]: value } : member
    );
    saveTeam(updated);
  }

  function handleDelete(id) {
    if (window.confirm("Delete this team member?")) {
      const filtered = team.filter((member) => member.id !== id);
      saveTeam(filtered);
    }
  }

  function handleAdd() {
    if (!newMember.name.trim() || !newMember.role.trim()) {
      alert("Name and Role are required");
      return;
    }
    const memberToAdd = {
      ...newMember,
      id: Date.now(),
      photo: newMember.photo.trim() || "/assets/default-profile.png",
    };
    const updated = [...team, memberToAdd];
    saveTeam(updated);
    setNewMember({ name: "", role: "", photo: "" });
  }

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "1rem" }}>
      <h2>Meet the Team Editor</h2>

      {team.length === 0 && <p>No team members yet.</p>}

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {team.map(({ id, name, role, photo }) => (
          <li
            key={id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
              borderBottom: "1px solid #ccc",
              paddingBottom: "1rem",
            }}
          >
            <img
              src={photo}
              alt={name}
              style={{ width: 80, height: 80, objectFit: "cover", borderRadius: "50%" }}
            />
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={name}
                onChange={(e) => handleChange(id, "name", e.target.value)}
                style={{ width: "100%", marginBottom: 6, padding: 6 }}
                placeholder="Name"
              />
              <input
                type="text"
                value={role}
                onChange={(e) => handleChange(id, "role", e.target.value)}
                style={{ width: "100%", padding: 6 }}
                placeholder="Role"
              />
              <input
                type="text"
                value={photo}
                onChange={(e) => handleChange(id, "photo", e.target.value)}
                style={{ width: "100%", marginTop: 6, padding: 6, fontSize: "0.9rem" }}
                placeholder="Photo URL"
              />
            </div>
            <button
              onClick={() => handleDelete(id)}
              style={{
                backgroundColor: "#dc3545",
                border: "none",
                color: "white",
                borderRadius: 4,
                padding: "6px 10px",
                cursor: "pointer",
                height: 40,
              }}
              aria-label={`Delete ${name}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h3>Add New Team Member</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: 400 }}>
        <input
          type="text"
          placeholder="Name"
          value={newMember.name}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          style={{ padding: 8 }}
        />
        <input
          type="text"
          placeholder="Role"
          value={newMember.role}
          onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
          style={{ padding: 8 }}
        />
        <input
          type="text"
          placeholder="Photo URL (optional)"
          value={newMember.photo}
          onChange={(e) => setNewMember({ ...newMember, photo: e.target.value })}
          style={{ padding: 8 }}
        />
        <button
          onClick={handleAdd}
          style={{
            backgroundColor: "#a77b5a",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "0.75rem",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Add Member
        </button>
      </div>

      {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}
