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
  const { title, description, location, price, photos = [] } = req.body;

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
    host_id: 1, // Mock user ID
    photos: photos || [],
    created_at: new Date().toISOString(),
  };

  stays.push(newStay);

  console.log(`New stay created: ${title} with ${photos.length} photos`);

  res.status(201).json(newStay);
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
