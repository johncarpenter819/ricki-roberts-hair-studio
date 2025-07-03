import { useEffect, useState } from "react";

const mockAppointments = [
  { id: 1, name: "Sarah Johnson", service: "Haircut", date: "2025-07-05", time: "10:00 AM" },
  { id: 2, name: "Michael Lee", service: "Color", date: "2025-07-06", time: "2:00 PM" },
  { id: 3, name: "Emma Davis", service: "Styling", date: "2025-07-06", time: "4:00 PM" },
];

function isToday(dateStr) {
  const today = new Date();
  const date = new Date(dateStr);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export default function Dashboard() {
  const [todaysAppointments, setTodaysAppointments] = useState([]);

  useEffect(() => {
    // Filter mock appointments for today
    const todayAppts = mockAppointments.filter((appt) => isToday(appt.date));
    setTodaysAppointments(todayAppts);
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h2>Welcome to the Admin Dashboard</h2>
      <p>Here is a quick overview of today’s appointments.</p>

      {todaysAppointments.length === 0 ? (
        <p>No appointments scheduled for today.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#a77b5a", color: "white" }}>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Name</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Service</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {todaysAppointments.map(({ id, name, service, time }) => (
              <tr key={id}>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{name}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{service}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
