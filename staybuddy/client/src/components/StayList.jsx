import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiCall } from "../services/api";

const StayList = () => {
  const [stays, setStays] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStays = async () => {
      try {
        setLoading(true);
        const data = await apiCall("/stays");
        setStays(data);
        setError(null);
      } catch (err) {
        console.error("Network error:", err);
        setError(
          "Unable to load stays. Please check if the backend server is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStays();
  }, []);

  if (loading) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Find Your Perfect Stay</h1>
            <p className="page-subtitle">Loading amazing places...</p>
          </div>
          <div className="text-center">
            <div style={{ fontSize: "2rem" }}>🏠</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Find Your Perfect Stay</h1>
            <p className="page-subtitle">
              Discover unique accommodations around the world
            </p>
          </div>
          <div className="error">
            <strong>Oops!</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Find Your Perfect Stay</h1>
          <p className="page-subtitle">
            Discover unique accommodations around the world
          </p>
        </div>

        {stays.length === 0 ? (
          <div className="text-center">
            <div style={{ fontSize: "4rem", marginBottom: "24px" }}>🏠</div>
            <h3>No stays available yet</h3>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "32px",
              }}
            >
              Be the first to list your amazing space!
            </p>
            <Link to="/host/new" className="btn btn-primary">
              List Your Space
            </Link>
          </div>
        ) : (
          <div className="stay-grid">
            {stays.map((stay) => (
              <Link
                key={stay.id}
                to={`/stays/${stay.id}`}
                className="stay-card"
              >
                <div className="stay-image">🏠</div>
                <div className="stay-content">
                  <h3 className="stay-title">{stay.title}</h3>
                  <div className="stay-location">📍 {stay.location}</div>
                  <div className="stay-price">
                    ${stay.price}
                    <span className="stay-price-unit">/night</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StayList;
