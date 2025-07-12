// TeamEditor.jsx
import { useState, useEffect } from "react";
import { useTeam } from "../context/TeamContext";
import "../styles/AdminPortal.css";

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

  const [localTeam, setLocalTeam] = useState([]);

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

  function handleLocalChange(id, field, value) {
    setLocalTeam((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  }

  function handleSave(id) {
    const updatedMember = localTeam.find((m) => m.id === id);
    if (updatedMember) {
      saveTeam(localTeam); // Save the entire localTeam
    }
  }

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      const updatedTeam = team.filter((member) => member.id !== id);
      saveTeam(updatedTeam);
    }
  }

  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    bio: "",
    photo: "", // This will store a local URL for preview or a Firebase URL after upload
  });

  function handleAdd() {
    if (!newMember.name || !newMember.role || !newMember.bio) {
      setMessage("Please fill in all fields for the new team member.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    const memberToAdd = { ...newMember, id: Date.now() }; // Simple ID generation
    saveTeam([...team, memberToAdd]);
    setNewMember({ name: "", role: "", bio: "", photo: "" }); // Reset form
    document.getElementById("new-member-photo-upload").value = ""; // Clear file input
  }

  return (
    <div className="team-editor-container">
      <h2>Manage Team</h2>

      <div className="team-members-list">
        {localTeam.map((member) => (
          <div key={member.id} className="team-member-card">
            <img
              src={member.photo}
              alt={member.name}
              className="team-member-photo"
            />
            <div className="member-details">
              <label className="admin-label">
                Name:
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) =>
                    handleLocalChange(member.id, "name", e.target.value)
                  }
                  className="admin-input"
                />
              </label>
              <label className="admin-label">
                Role:
                <input
                  type="text"
                  value={member.role}
                  onChange={(e) =>
                    handleLocalChange(member.id, "role", e.target.value)
                  }
                  className="admin-input"
                />
              </label>
              <label className="admin-label">
                Bio:
                <textarea
                  value={member.bio}
                  onChange={(e) =>
                    handleLocalChange(member.id, "bio", e.target.value)
                  }
                  className="admin-textarea"
                  rows={4}
                />
              </label>
              <div className="team-member-actions">
                <button
                  onClick={() => handleSave(member.id)}
                  className="team-editor-save-button" // Changed class name here
                >
                  Save
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="admin-cancel-button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2>Add New Team Member</h2>
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
        <button onClick={handleAdd} className="team-editor-add-member-button">
          Add Member
        </button>
      </div>

      {message && <p className="admin-message">{message}</p>}
    </div>
  );
}