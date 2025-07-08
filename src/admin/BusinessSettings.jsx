import { useState } from "react";
import { useBusiness } from "../context/BusinessContext";
import '../styles/AdminPortal.css'; // import shared admin styles

export default function BusinessSettings() {
  const { hours, setHours, contact, setContact, about, setAbout } = useBusiness();
  const [message, setMessage] = useState("");

  const handleHourChange = (day, value) => {
    setHours((prev) => ({ ...prev, [day]: value }));
  };

  const handleContactChange = (field, value) => {
    setContact((prev) => ({ ...prev, [field]: value }));
  };

  const handleAboutChange = (value) => {
    setAbout(value);
  };

  const handleSave = () => {
    setMessage("Business hours, contact info, and About Us saved!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="admin-container">
      <h2>Business Settings</h2>

      <h3>Business Hours</h3>
      <table className="admin-table" style={{ marginBottom: "1rem" }}>
        <tbody>
          {Object.entries(hours).map(([day, time]) => (
            <tr key={day}>
              <td style={{ fontWeight: "600", width: '30%', paddingLeft: '1rem' }}>{day}</td>
              <td>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => handleHourChange(day, e.target.value)}
                  className="admin-input"
                  style={{ width: '100%' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Contact Info</h3>
      <label className="admin-label">
        Phone:
        <input
          type="tel"
          value={contact.phone}
          onChange={(e) => handleContactChange("phone", e.target.value)}
          className="admin-input"
        />
      </label>
      <label className="admin-label">
        Email:
        <input
          type="email"
          value={contact.email}
          onChange={(e) => handleContactChange("email", e.target.value)}
          className="admin-input"
        />
      </label>
      <label className="admin-label">
        Address:
        <textarea
          value={contact.address}
          onChange={(e) => handleContactChange("address", e.target.value)}
          rows={3}
          className="admin-textarea"
        />
      </label>

      <h3>About Us</h3>
      <textarea
        value={about}
        onChange={(e) => handleAboutChange(e.target.value)}
        rows={5}
        className="admin-textarea"
        style={{ width: '100%', marginBottom: '1rem' }}
      />

      <button onClick={handleSave} className="admin-button" style={{ marginTop: '1rem' }}>
        Save
      </button>

      {message && <p className="admin-message">{message}</p>}
    </div>
  );
}
