const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

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
    price: 150,
    location: "California",
    host_id: 1,
  },
  {
    id: 2,
    title: "Mountain Cabin",
    description: "Perfect retreat in the mountains",
    price: 120,
    location: "Colorado",
    host_id: 1,
  },
];

// Auth endpoints
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = users.find((u) => u.email === email);

  if (user && user.password === password) {
    res.json({
      token: "mock-jwt-token-" + Date.now(),
      user: { id: user.id, username: user.username, email: user.email },
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.post("/auth/signup", (req, res) => {
  const { username, email, password } = req.body;

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
  };

  users.push(newUser);

  res.json({
    token: "mock-jwt-token-" + Date.now(),
    user: { id: newUser.id, username: newUser.username, email: newUser.email },
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
  console.log("  POST /bookings");
  console.log("  GET /bookings");
});
