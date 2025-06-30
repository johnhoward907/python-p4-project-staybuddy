import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const StayList = () => {
  const [stays, setStays] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/stays")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stays");
        return res.json();
      })
      .then((data) => setStays(data))
      .catch((err) => {
        console.error("Network error:", err);
        setError(
          "Server unavailable. Please check if the backend server is running on port 5000.",
        );
      });
  }, []);

  return (
    <div>
      <h2>All Stays</h2>
      <ul>
        {stays.map((stay) => (
          <li key={stay.id}>
            <Link to={`/stays/${stay.id}`}>
              <strong>{stay.title}</strong> — {stay.location} — ${stay.price}
              /night
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StayList;
