// src/admin/BusinessSettings.jsx
import { useState } from "react";
import { useBusiness } from "../context/BusinessContext";

export default function BusinessSettings() {
  const { hours, setHours, contact, setContact } = useBusiness();
  const [message, setMessage] = useState("");

  const handleHourChange = (day, value) => {
    setHours((prev) => ({ ...prev, [day]: value }));
  };

  const handleContactChange = (field, value) => {
    setContact((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setMessage("Business hours and contact info saved!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h2>Business Settings</h2>

      <h3>Business Hours</h3>
      <table style={{ width: "100%", marginBottom: "1rem" }}>
        <tbody>
          {Object.entries(hours).map(([day, time]) => (
            <tr key={day}>
              <td style={{ padding: "0.5rem", fontWeight: "600" }}>{day}</td>
              <td>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => handleHourChange(day, e.target.value)}
                  style={{ width: "100%", padding: "0.3rem" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Contact Info</h3>
      <label>
        Phone:
        <input
          type="tel"
          value={contact.phone}
          onChange={(e) => handleContactChange("phone", e.target.value)}
          style={{ width: "100%", padding: "0.3rem", marginBottom: "0.5rem" }}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={contact.email}
          onChange={(e) => handleContactChange("email", e.target.value)}
          style={{ width: "100%", padding: "0.3rem", marginBottom: "0.5rem" }}
        />
      </label>
      <label>
        Address:
        <textarea
          value={contact.address}
          onChange={(e) => handleContactChange("address", e.target.value)}
          rows={3}
          style={{ width: "100%", padding: "0.3rem" }}
        />
      </label>

      <button
        onClick={handleSave}
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          backgroundColor: "#a77b5a",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Save
      </button>

      {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}
