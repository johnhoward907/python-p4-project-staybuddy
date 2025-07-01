import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const StayDetails = () => {
  const { id } = useParams();
  const [stay, setStay] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStay = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/stays/${id}`);
        if (response.ok) {
          const data = await response.json();
          setStay(data);
        } else {
          setError("Stay not found");
        }
      } catch (err) {
        setError("Failed to load stay details");
        console.error("Error fetching stay:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStay();
  }, [id]);

  if (loading) {
    return (
      <div className="main-content">
        <div className="container text-center">
          <div style={{ fontSize: "2rem", marginBottom: "16px" }}>🏠</div>
          <p>Loading stay details...</p>
        </div>
      </div>
    );
  }

  if (error || !stay) {
    return (
      <div className="main-content">
        <div className="container text-center">
          <h1>Stay Not Found</h1>
          <p>{error || "The stay you're looking for doesn't exist."}</p>
          <Link to="/" className="btn btn-primary">
            Back to Stays
          </Link>
        </div>
      </div>
    );
  }

  const hasPhotos = stay.photos && stay.photos.length > 0;

  return (
    <div className="main-content">
      <div className="container">
        {/* Header */}
        <div className="stay-header">
          <h1 className="stay-title">{stay.title}</h1>
          <div className="stay-location">📍 {stay.location}</div>
        </div>

        {/* Photo Gallery */}
        {hasPhotos && (
          <div className="photo-gallery">
            <div className="main-photo">
              <img
                src={stay.photos[selectedPhotoIndex].url}
                alt={stay.photos[selectedPhotoIndex].name || stay.title}
                onError={(e) => {
                  e.target.src =
                    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400"><rect width="800" height="400" fill="%23f0f0f0"/><text x="400" y="200" text-anchor="middle" fill="%23999">Image not available</text></svg>';
                }}
              />
              {stay.photos.length > 1 && (
                <>
                  <button
                    className="photo-nav photo-nav-prev"
                    onClick={() =>
                      setSelectedPhotoIndex((prev) =>
                        prev === 0 ? stay.photos.length - 1 : prev - 1,
                      )
                    }
                  >
                    ◀
                  </button>
                  <button
                    className="photo-nav photo-nav-next"
                    onClick={() =>
                      setSelectedPhotoIndex((prev) =>
                        prev === stay.photos.length - 1 ? 0 : prev + 1,
                      )
                    }
                  >
                    ▶
                  </button>
                </>
              )}
            </div>

            {stay.photos.length > 1 && (
              <div className="photo-thumbnails">
                {stay.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo.url}
                    alt={photo.name || `Photo ${index + 1}`}
                    className={`thumbnail ${index === selectedPhotoIndex ? "active" : ""}`}
                    onClick={() => setSelectedPhotoIndex(index)}
                    onError={(e) => {
                      e.target.src =
                        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="75"><rect width="100" height="75" fill="%23f0f0f0"/><text x="50" y="40" text-anchor="middle" fill="%23999" font-size="10">No image</text></svg>';
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stay Details */}
        <div className="stay-details">
          <div className="stay-info">
            <div className="stay-price-section">
              <span className="stay-price-large">KSH {stay.price}</span>
              <span className="stay-price-unit"> per night</span>
            </div>

            {stay.description && (
              <div className="stay-description-section">
                <h3>About this place</h3>
                <p className="stay-description">{stay.description}</p>
              </div>
            )}

            <div className="stay-actions">
              <Link
                to={`/book/${stay.id}`}
                className="btn btn-primary btn-large"
              >
                Book This Stay
              </Link>
              <Link to="/" className="btn btn-secondary">
                Back to Stays
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StayDetails;
