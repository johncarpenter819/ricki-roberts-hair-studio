import { useState, useEffect } from "react";
import { useBusiness } from "../context/BusinessContext";
import { getAllReviews, approveReview, deleteReview } from "../utils/firestore";
import '../styles/AdminPortal.css';

export default function BusinessSettings() {
  const { hours, setHours, contact, setContact, about, setAbout } = useBusiness();
  const [message, setMessage] = useState("");
  const [allReviews, setAllReviews] = useState([]);

  // Track hovered review id and tooltip position for full text display
  const [hoveredReview, setHoveredReview] = useState({ id: null, x: 0, y: 0 });

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

  // On mouse enter, get bounding rect and save id + position for tooltip
  const handleMouseEnter = (id, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredReview({
      id,
      x: rect.right + 10, // show tooltip slightly right of cell
      y: rect.top,
    });
  };

  const handleMouseLeave = () => {
    setHoveredReview({ id: null, x: 0, y: 0 });
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
        <div className="admin-reviews-table-wrapper" style={{ position: "relative" }}>
          <table className="admin-table reviews-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Service</th>
                <th>Stylist</th>
                <th>Stars</th>
                <th>Review</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allReviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.name || "Anonymous"}</td>
                  <td>{review.service}</td>
                  <td>{review.stylist}</td>
                  <td>{review.stars} ⭐</td>
                  <td
                    className="review-cell"
                    onMouseEnter={(e) => handleMouseEnter(review.id, e)}
                    onMouseLeave={handleMouseLeave}
                    style={{ position: "relative" }}
                  >
                    {review.text.length > 40
                      ? review.text.slice(0, 40) + "…"
                      : review.text}
                  </td>
                  <td style={{ color: review.approved ? "green" : "orange" }}>
                    {review.approved ? "Approved" : "Pending"}
                  </td>
                  <td>
                    {!review.approved && (
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="admin-button"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="admin-button admin-button-deny"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tooltip shown outside table cell to prevent clipping */}
          {hoveredReview.id && (
            <div
              className="review-tooltip"
              style={{
                position: "fixed",
                top: hoveredReview.y + "px",
                left: hoveredReview.x + "px",
                zIndex: 9999,
                maxWidth: "320px",
                background: "#fff7ef",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                color: "#4b3b2b",
                fontSize: "0.9rem",
                lineHeight: 1.4,
                whiteSpace: "normal",
                wordWrap: "break-word",
                pointerEvents: "none",
              }}
            >
              {allReviews.find((r) => r.id === hoveredReview.id)?.text}
            </div>
          )}
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