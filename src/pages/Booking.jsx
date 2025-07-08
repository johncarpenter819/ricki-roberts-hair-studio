import '../styles/Booking.css';
import { useState, useEffect } from 'react';
import { useServices } from '../context/ServicesContext';
import { useAppointments } from '../context/AppointmentsContext';
import { useTeam } from '../context/TeamContext';

function formatTimeTo12Hour(time24) {
  const [hour, minute] = time24.split(':');
  const hourNum = parseInt(hour);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum % 12 || 12;
  return `${hour12}:${minute} ${ampm}`;
}

export default function Booking() {
  const { services } = useServices();
  const { appointments, setAppointments } = useAppointments();
  const { team } = useTeam();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    serviceId: '',
    stylistId: '',
    date: '',
    time: '',
    subscribe: false,
  });

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, [setAppointments]);

  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem('appointments', JSON.stringify(appointments));
    }
  }, [appointments]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedService = services.find((s) => s.id === parseInt(form.serviceId));
    const selectedStylist = team.find((t) => t.id === parseInt(form.stylistId));

    if (!selectedService || !selectedStylist) {
      alert('Please select a valid service and stylist.');
      return;
    }

    const newAppointment = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      service: selectedService.name,
      stylist: selectedStylist.name,
      date: form.date,
      time: formatTimeTo12Hour(form.time),
      status: 'Confirmed',
      subscribe: form.subscribe,
    };

    setAppointments([...appointments, newAppointment]);

    alert(`Thank you, ${form.name}! Your ${selectedService.name} with ${selectedStylist.name} is booked.`);

    setForm({
      name: '',
      email: '',
      phone: '',
      serviceId: '',
      stylistId: '',
      date: '',
      time: '',
      subscribe: false,
    });
  };

  return (
    <div className={`booking-page ${hydrated ? 'visible' : ''}`}>
      <h1 className="booking-title">Book an Appointment</h1>

      {!hydrated ? (
        <p>Loading form...</p>
      ) : (
        <form className="booking-form" onSubmit={handleSubmit}>

          <label className="booking-label" htmlFor="name">
            Name
            <input
              id="name"
              className="booking-input"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="booking-label" htmlFor="email">
            Email
            <input
              id="email"
              className="booking-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="booking-label" htmlFor="phone">
            Phone Number
            <input
              id="phone"
              className="booking-input"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </label>

          <label className="booking-label" htmlFor="serviceId">
            Service
            <select
              id="serviceId"
              className="booking-select"
              name="serviceId"
              value={form.serviceId}
              onChange={handleChange}
              required
            >
              <option value="">Select a Service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — ${s.price.toFixed(2)}
                </option>
              ))}
            </select>
          </label>

          <label className="booking-label" htmlFor="stylistId">
            Stylist
            <select
              id="stylistId"
              className="booking-select"
              name="stylistId"
              value={form.stylistId}
              onChange={handleChange}
              required
            >
              <option value="">Select a Stylist</option>
              {team.map((stylist) => (
                <option key={stylist.id} value={stylist.id}>
                  {stylist.name}
                </option>
              ))}
            </select>
          </label>

          <label className="booking-label" htmlFor="date">
            Date
            <input
              id="date"
              className="booking-input"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </label>

          <label className="booking-label" htmlFor="time">
            Time
            <input
              id="time"
              className="booking-input"
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </label>

          <label className="checkbox-label" htmlFor="subscribe">
            <input
              id="subscribe"
              type="checkbox"
              name="subscribe"
              checked={form.subscribe}
              onChange={handleChange}
            />
            I’d like to receive newsletters, discounts, or service updates.
          </label>

          <button type="submit" className="cta-btn">
            Book Now
          </button>
        </form>
      )}
    </div>
  );
}
