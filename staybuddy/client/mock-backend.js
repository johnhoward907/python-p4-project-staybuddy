const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Mock user database
const users = [
  {
    id: 1,
    username: "demo",
    email: "demo@example.com",
    password: "password123",
  },
];

// Mock stays database
const stays = [
  {
    id: 1,
    title: "Cozy Beach House",
    description: "A beautiful beach house with ocean views",
    price: 15000,
    location: "Diani Beach, Mombasa",
    host_id: 1,
    photos: [
      {
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
        type: "url",
        name: "Beach House Main",
      },
      {
        url: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=500",
        type: "url",
        name: "Ocean View",
      },
    ],
  },
  {
    id: 2,
    title: "Mountain Cabin",
    description: "Perfect retreat in the mountains",
    price: 12000,
    location: "Mount Kenya, Nyeri",
    host_id: 1,
    photos: [
      {
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500",
        type: "url",
        name: "Mountain Cabin",
      },
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500",
        type: "url",
        name: "Forest View",
      },
    ],
  },
];

// Auth endpoints
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  console.log(`Login attempt: ${email}`);

  // Find user
  const user = users.find((u) => u.email === email);

  if (user && user.password === password) {
    console.log(`Login successful for: ${email}`);
    res.json({
      token: "mock-jwt-token-" + Date.now(),
      user: { id: user.id, username: user.username, email: user.email },
    });
  } else {
    console.log(
      `Login failed for: ${email} - ${user ? "Wrong password" : "User not found"}`,
    );
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.post("/auth/signup", (req, res) => {
  const { username, email, password, phone } = req.body;

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "Email already registered" });
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password,
    phone,
  };

  users.push(newUser);

  res.json({
    token: "mock-jwt-token-" + Date.now(),
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
    },
  });
});

app.get("/auth/check_session", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    res.json({ user: { id: 1, username: "demo", email: "demo@example.com" } });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// Stays endpoints
app.get("/stays", (req, res) => {
  res.json(stays);
});

app.get("/stays/:id", (req, res) => {
  const stay = stays.find((s) => s.id === parseInt(req.params.id));
  if (stay) {
    res.json(stay);
  } else {
    res.status(404).json({ error: "Stay not found" });
  }
});

app.post("/stays", (req, res) => {
  const {
    title,
    description,
    location,
    price,
    contact_phone,
    photos = [],
  } = req.body;

  if (!title || !location || !price) {
    return res
      .status(400)
      .json({ error: "Title, location, and price are required" });
  }

  const newStay = {
    id: stays.length + 1,
    title,
    description: description || "",
    location,
    price: parseFloat(price),
    contact_phone: contact_phone || "",
    host_id: 1, // Mock user ID
    photos: photos || [],
    created_at: new Date().toISOString(),
  };

  stays.push(newStay);

  console.log(`New stay created: ${title} with ${photos.length} photos`);

  res.status(201).json(newStay);
});

app.patch("/stays/:id", (req, res) => {
  const stayId = parseInt(req.params.id);
  const stay = stays.find((s) => s.id === stayId);

  if (!stay) {
    return res.status(404).json({ error: "Stay not found" });
  }

  // In a real app, you'd check if user owns this stay
  // For mock, we'll allow any update

  const { title, description, location, price, contact_phone, photos } =
    req.body;

  if (title) stay.title = title;
  if (description !== undefined) stay.description = description;
  if (location) stay.location = location;
  if (price) stay.price = parseFloat(price);
  if (contact_phone !== undefined) stay.contact_phone = contact_phone;
  if (photos) stay.photos = photos;

  console.log(`Stay ${stayId} updated: ${stay.title}`);

  res.json(stay);
});

app.delete("/stays/:id", (req, res) => {
  const stayId = parseInt(req.params.id);
  const index = stays.findIndex((s) => s.id === stayId);

  if (index === -1) {
    return res.status(404).json({ error: "Stay not found" });
  }

  // In a real app, you'd check if user owns this stay
  // For mock, we'll allow any deletion

  stays.splice(index, 1);
  console.log(`Stay ${stayId} deleted`);

  res.json({ message: "Stay deleted successfully" });
});

// Bookings endpoints
app.post("/bookings", (req, res) => {
  res.json({ id: 1, ...req.body, status: "confirmed" });
});

app.get("/bookings", (req, res) => {
  res.json([
    {
      id: 1,
      stay_id: 1,
      check_in: "2024-01-15",
      check_out: "2024-01-20",
      status: "confirmed",
    },
  ]);
});

// Mock reviews database
const reviews = [
  {
    id: 1,
    stay_id: 1,
    user_id: 1,
    rating: 5,
    comment:
      "Amazing place! The beach view was incredible and the host was very responsive.",
    created_at: new Date().toISOString(),
    author: { id: 1, username: "demo", email: "demo@example.com" },
  },
  {
    id: 2,
    stay_id: 1,
    user_id: 2,
    rating: 4,
    comment:
      "Great location and clean facilities. Would definitely stay again!",
    created_at: new Date().toISOString(),
    author: { id: 2, username: "traveler", email: "traveler@example.com" },
  },
];

// Mock favorites database
const favorites = [];

// Reviews endpoints
app.get("/reviews/stay/:stayId", (req, res) => {
  const stayId = parseInt(req.params.stayId);
  const stayReviews = reviews.filter((r) => r.stay_id === stayId);
  res.json(stayReviews);
});

app.post("/reviews", (req, res) => {
  const { stay_id, rating, comment } = req.body;

  if (!stay_id || !rating || !comment) {
    return res
      .status(400)
      .json({ error: "Stay ID, rating, and comment are required" });
  }

  const newReview = {
    id: reviews.length + 1,
    stay_id: parseInt(stay_id),
    user_id: 1, // Mock user ID
    rating: parseInt(rating),
    comment,
    created_at: new Date().toISOString(),
    author: { id: 1, username: "demo", email: "demo@example.com" },
  };

  reviews.push(newReview);
  console.log(`New review created for stay ${stay_id}: ${rating} stars`);

  res.status(201).json(newReview);
});

// Favorites endpoints
app.get("/favorites", (req, res) => {
  // Return favorites with stay details
  const userFavorites = favorites.map((fav) => ({
    ...fav,
    stay: stays.find((s) => s.id === fav.stay_id),
  }));
  res.json(userFavorites);
});

app.post("/favorites", (req, res) => {
  const { stay_id, notes } = req.body;

  if (!stay_id) {
    return res.status(400).json({ error: "Stay ID is required" });
  }

  // Check if already favorited
  const existing = favorites.find(
    (f) => f.stay_id === parseInt(stay_id) && f.user_id === 1,
  );
  if (existing) {
    return res.status(400).json({ error: "Stay already in favorites" });
  }

  const newFavorite = {
    id: favorites.length + 1,
    user_id: 1, // Mock user ID
    stay_id: parseInt(stay_id),
    notes: notes || "",
    date_added: new Date().toISOString(),
  };

  favorites.push(newFavorite);
  console.log(`Stay ${stay_id} added to favorites`);

  res.status(201).json(newFavorite);
});

app.get("/favorites/check/:stayId", (req, res) => {
  const stayId = parseInt(req.params.stayId);
  const favorite = favorites.find(
    (f) => f.stay_id === stayId && f.user_id === 1,
  );

  res.json({
    is_favorited: !!favorite,
    favorite_id: favorite?.id || null,
    notes: favorite?.notes || null,
  });
});

app.patch("/favorites/:favoriteId", (req, res) => {
  const favoriteId = parseInt(req.params.favoriteId);
  const { notes } = req.body;

  const favorite = favorites.find((f) => f.id === favoriteId);
  if (!favorite) {
    return res.status(404).json({ error: "Favorite not found" });
  }

  favorite.notes = notes;
  console.log(`Favorite ${favoriteId} notes updated`);

  res.json(favorite);
});

app.delete("/favorites/:favoriteId", (req, res) => {
  const favoriteId = parseInt(req.params.favoriteId);
  const index = favorites.findIndex((f) => f.id === favoriteId);

  if (index === -1) {
    return res.status(404).json({ error: "Favorite not found" });
  }

  favorites.splice(index, 1);
  console.log(`Favorite ${favoriteId} removed`);

  res.json({ message: "Favorite removed successfully" });
});

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Mock StayBuddy Backend Server Running", status: "ok" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Mock backend server running on http://localhost:${PORT}`);
  console.log("Available endpoints:");
  console.log("  POST /auth/login");
  console.log("  POST /auth/signup");
  console.log("  GET /auth/check_session");
  console.log("  GET /stays");
  console.log("  GET /stays/:id");
  console.log("  POST /stays");
  console.log("  PATCH /stays/:id");
  console.log("  DELETE /stays/:id");
  console.log("  POST /bookings");
  console.log("  GET /bookings");
  console.log("  GET /reviews/stay/:stayId");
  console.log("  POST /reviews");
  console.log("  GET /favorites");
  console.log("  POST /favorites");
  console.log("  GET /favorites/check/:stayId");
  console.log("  PATCH /favorites/:favoriteId");
  console.log("  DELETE /favorites/:favoriteId");
});
