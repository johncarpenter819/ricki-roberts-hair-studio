import { useState, useEffect } from "react";
import { useBusiness } from "../context/BusinessContext";
import { getPendingReviews, approveReview } from "../utils/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import '../styles/AdminPortal.css'; // shared admin styles

export default function BusinessSettings() {
  const { hours, setHours, contact, setContact, about, setAbout } = useBusiness();
  const [message, setMessage] = useState("");
  const [pendingReviews, setPendingReviews] = useState([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const reviews = await getPendingReviews();
    setPendingReviews(reviews);
  };

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

  const handleApprove = async (id) => {
    await approveReview(id);
    setPendingReviews(prev => prev.filter(r => r.id !== id));
  };

  const denyReview = async (id) => {
    await deleteDoc(doc(db, "reviews", id));
    setPendingReviews(prev => prev.filter(r => r.id !== id));
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

      <h3>Pending Reviews for Approval</h3>
      {pendingReviews.length === 0 ? (
        <p style={{ fontStyle: "italic" }}>No new reviews awaiting approval.</p>
      ) : (
        <div className="review-approval-list">
          {pendingReviews.map((review) => (
            <div key={review.id} className="review-card">
              <p><strong>Name:</strong> {review.name || "Anonymous"}</p>
              <p><strong>Service:</strong> {review.service}</p>
              <p><strong>Stylist:</strong> {review.stylist}</p>
              <p><strong>Rating:</strong> {review.stars} ⭐</p>
              <p><strong>Review:</strong> {review.text}</p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button onClick={() => handleApprove(review.id)} className="admin-button">
                  Approve
                </button>
                <button onClick={() => denyReview(review.id)} className="admin-button admin-button-deny">
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
