import { useState, useEffect } from "react";
import { useTeam } from "../context/TeamContext";
import "../styles/AdminPortal.css"; // assuming shared admin styles here

const defaultTeam = [
  {
    id: 1,
    name: "Ricque Roberts",
    role: "Owner & Master Stylist",
    photo: "/assets/ricque.jpg",
  },
];

export default function TeamEditor() {
  const { team, setTeam } = useTeam();
  const [newMember, setNewMember] = useState({ name: "", role: "", photo: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!team || team.length === 0) {
      setTeam(defaultTeam);
    }
  }, [team, setTeam]);

  function saveTeam(updatedTeam) {
    setTeam(updatedTeam);
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
      photo:
        newMember.photo && typeof newMember.photo === "string" && newMember.photo.startsWith("blob:")
          ? newMember.photo
          : "/assets/default-profile.png",
    };
    const updated = [...team, memberToAdd];
    saveTeam(updated);
    setNewMember({ name: "", role: "", photo: "" });
  }

  return (
    <div className="admin-container team-editor-container">
      <h2>Meet the Team Editor</h2>

      {(!team || team.length === 0) && <p>No team members yet.</p>}

      <ul className="team-list">
        {team &&
          team.map(({ id, name, role, photo }) => (
            <li key={id} className="team-member">
              <img src={photo} alt={name} className="team-photo" />
              <div className="team-info">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleChange(id, "name", e.target.value)}
                  className="admin-input"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => handleChange(id, "role", e.target.value)}
                  className="admin-input"
                  placeholder="Role"
                />
                <input
                  type="file"
                  accept="image/*"
                  id={`photo-upload-${id}`}
                  className="photo-input"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const localUrl = URL.createObjectURL(file);
                      handleChange(id, "photo", localUrl);
                    }
                  }}
                  style={{ display: "none" }}
                />
                <label htmlFor={`photo-upload-${id}`} className="upload-button">
                  Choose Photo
                </label>
              </div>
              <button
                onClick={() => handleDelete(id)}
                className="delete-button"
                aria-label={`Delete ${name}`}
              >
                Delete
              </button>
            </li>
          ))}
      </ul>

      <h3>Add New Team Member</h3>
      <div className="add-member-form">
        <input
          type="text"
          placeholder="Name"
          value={newMember.name}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          className="admin-input"
        />
        <input
          type="text"
          placeholder="Role"
          value={newMember.role}
          onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
          className="admin-input"
        />
        <input
          type="file"
          accept="image/*"
          id="new-member-photo-upload"
          className="photo-input"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const localUrl = URL.createObjectURL(file);
              setNewMember((prev) => ({ ...prev, photo: localUrl }));
            }
          }}
          style={{ display: "none" }}
        />
        <label htmlFor="new-member-photo-upload" className="upload-button">
          Choose Photo
        </label>
        <button onClick={handleAdd} className="admin-button add-member-button">
          Add Member
        </button>
      </div>

      {message && <p className="admin-message">{message}</p>}
    </div>
  );
}
