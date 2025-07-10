import { useState, useEffect } from "react";
import { useBusiness } from "../context/BusinessContext";
import { getAllReviews, approveReview, deleteReview } from "../utils/firestore";
import '../styles/AdminPortal.css';

export default function BusinessSettings() {
  const { hours, setHours, contact, setContact, about, setAbout } = useBusiness();
  const [message, setMessage] = useState("");

  const [allReviews, setAllReviews] = useState([]);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    const reviews = await getAllReviews();
    setAllReviews(reviews);
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
    setMessage("Review approved!");
    fetchAllReviews();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteReview(id);
      setMessage("Review deleted!");
      fetchAllReviews();
    }
  };

  return (
    <div className="admin-container">
      <h2>Business Settings</h2>

      {/* Business Hours Section */}
      <h3>Business Hours</h3>
      <table className="admin-table" style={{ marginBottom: "1rem" }}>
        <tbody>
          {Object.entries(hours).map(([day, time]) => (
            <tr key={day}>
              <td style={{ fontWeight: "600", width: "30%", paddingLeft: "1rem" }}>{day}</td>
              <td>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => handleHourChange(day, e.target.value)}
                  className="admin-input"
                  style={{ width: "100%" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* All Reviews Section */}
      <h3>All Reviews (Admin)</h3>
      {allReviews.length === 0 ? (
        <p style={{ fontStyle: "italic" }}>No reviews found.</p>
      ) : (
        <div className="review-approval-list">
          {allReviews.map((review) => (
            <div key={review.id} className="review-card">
              <p><strong>Name:</strong> {review.name || "Anonymous"}</p>
              <p><strong>Service:</strong> {review.service}</p>
              <p><strong>Stylist:</strong> {review.stylist}</p>
              <p><strong>Rating:</strong> {review.stars} ⭐</p>
              <p><strong>Review:</strong> {review.text}</p>
              <p>
                <strong>Status:</strong>{" "}
                {review.approved ? (
                  <span style={{ color: "green" }}>Approved</span>
                ) : (
                  <span style={{ color: "orange" }}>Pending</span>
                )}
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                {!review.approved && (
                  <button onClick={() => handleApprove(review.id)} className="admin-button">
                    Approve
                  </button>
                )}
                <button onClick={() => handleDelete(review.id)} className="admin-button admin-button-deny">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contact Info Section */}
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

      {/* About Us Section */}
      <h3>About Us</h3>
      <textarea
        value={about}
        onChange={(e) => handleAboutChange(e.target.value)}
        rows={5}
        className="admin-textarea"
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <button onClick={handleSave} className="admin-button" style={{ marginTop: "1rem" }}>
        Save
      </button>

      {message && <p className="admin-message">{message}</p>}
    </div>
  );
}
