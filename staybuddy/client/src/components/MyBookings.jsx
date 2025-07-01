import { useEffect, useState } from "react";
import { getToken } from "../services/api";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/bookings", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBookings(data || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Unable to load bookings. Please try again later.");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="main-content">
        <div className="container">
          <h2 className="page-title">My Bookings</h2>
          <div className="text-center">
            <div style={{ fontSize: "2rem", marginBottom: "16px" }}>📅</div>
            <p>Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="container">
          <h2 className="page-title">My Bookings</h2>
          <div className="error-message">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <h2 className="page-title">My Bookings</h2>

        {bookings.length === 0 ? (
          <div className="text-center">
            <div style={{ fontSize: "4rem", marginBottom: "24px" }}>📅</div>
            <h3>No bookings yet</h3>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "32px",
              }}
            >
              Start exploring amazing places to book your next stay!
            </p>
            <a href="/" className="btn btn-primary">
              Browse Stays
            </a>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h3>Booking #{booking.id}</h3>
                  <span className={`booking-status ${booking.status}`}>
                    {booking.status || "confirmed"}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="booking-info">
                    <strong>Stay ID:</strong> {booking.stay_id}
                  </div>

                  {booking.check_in && booking.check_out && (
                    <div className="booking-dates">
                      <div className="booking-info">
                        <strong>Check-in:</strong> {booking.check_in}
                      </div>
                      <div className="booking-info">
                        <strong>Check-out:</strong> {booking.check_out}
                      </div>
                    </div>
                  )}

                  {booking.note && (
                    <div className="booking-note">
                      <strong>Note:</strong> {booking.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
