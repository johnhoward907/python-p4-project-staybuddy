import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const StayList = () => {
  const [stays, setStays] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/stays')
      .then(res => res.json())
      .then(data => setStays(data));
  }, []);

  return (
    <div>
      <h2>All Stays</h2>
      <ul>
        {stays.map(stay => (
          <li key={stay.id}>
            <Link to={`/stays/${stay.id}`}>
              <strong>{stay.title}</strong> — {stay.location} — ${stay.price}/night
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StayList;