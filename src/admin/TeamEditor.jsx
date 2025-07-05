import { useState, useEffect } from "react";
import { useTeam } from "../context/TeamContext";
import "../styles/AdminPortal.css"; // assuming shared admin styles here

const defaultTeam = [
  {
    id: 1,
    name: "Ricque Roberts",
    role: "Owner & Master Stylist",
    photo: "/assets/ricque.jpg",
    bio: "Passionate about empowering clients through beauty and style.",
  },
];

export default function TeamEditor() {
  const { team, setTeam } = useTeam();
  const [message, setMessage] = useState("");

  // Local state to hold editable team members before saving
  const [localTeam, setLocalTeam] = useState([]);

  // Sync localTeam from team context initially or when team changes
  useEffect(() => {
    if (!team || team.length === 0) {
      setTeam(defaultTeam);
    } else {
      setLocalTeam(team);
    }
  }, [team, setTeam]);

  function saveTeam(updatedTeam) {
    setTeam(updatedTeam);
    setMessage("Team updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  }

  // Update local editable state when user types
  function handleLocalChange(id, field, value) {
    setLocalTeam((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  }

  // Save changes from local state to main team state for a single member
  function handleSave(id) {
    const updatedMember = localTeam.find((m) => m.id === id);
    if (!updatedMember) return;

    // Create new team array with the updated member replaced
    const updated = team.map((member) =>
      member.id === id ? updatedMember : member
    );
    saveTeam(updated);
  }

  function handleDelete(id) {
    if (window.confirm("Delete this team member?")) {
      const filtered = team.filter((member) => member.id !== id);
      saveTeam(filtered);
      // Also remove from localTeam
      setLocalTeam((prev) => prev.filter((m) => m.id !== id));
    }
  }

  // Add new member works as before
  const [newMember, setNewMember] = useState({ name: "", role: "", photo: "", bio: "" });
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
    setLocalTeam((prev) => [...prev, memberToAdd]); // keep local in sync

    setNewMember({ name: "", role: "", photo: "", bio: "" });
  }

  return (
    <div className="admin-container team-editor-container">
      <h2>Meet the Team Editor</h2>

      {(!localTeam || localTeam.length === 0) && <p>No team members yet.</p>}

      <ul className="team-list">
        {localTeam &&
          localTeam.map(({ id, name, role, photo, bio = "" }) => (
            <li key={id} className="team-member">
              <img src={photo} alt={name} className="team-photo" />
              <div className="team-info">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleLocalChange(id, "name", e.target.value)}
                  className="admin-input"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => handleLocalChange(id, "role", e.target.value)}
                  className="admin-input"
                  placeholder="Role"
                />
                <textarea
                  value={bio}
                  onChange={(e) => handleLocalChange(id, "bio", e.target.value)}
                  className="admin-textarea"
                  placeholder="Short bio or intro..."
                  rows={3}
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
                      handleLocalChange(id, "photo", localUrl);
                    }
                  }}
                  style={{ display: "none" }}
                />
                <label htmlFor={`photo-upload-${id}`} className="upload-button">
                  Choose Photo
                </label>
              </div>

              <div className="team-member-buttons">
                <button
                  onClick={() => handleDelete(id)}
                  className="delete-button"
                  aria-label={`Delete ${name}`}
                >
                  Delete
                </button>
                <button
                  onClick={() => handleSave(id)}
                  className="admin-button"
                  aria-label={`Save ${name}`}
                >
                  Save
                </button>
              </div>
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
        <textarea
          placeholder="Bio"
          value={newMember.bio}
          onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
          className="admin-textarea"
          rows={3}
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
