# Quick Start Guide - StayBuddy

## The Issue

The app currently shows these errors:

- **Proxy error**: Frontend can't connect to backend (backend not running)
- **Network error**: Body stream errors due to backend unavailability

## Solution

The **frontend is running** ✅ but the **backend server needs to be started** ❌

### Option 1: Use the startup script (Recommended)

```bash
cd staybuddy
chmod +x start-dev.sh
./start-dev.sh
```

### Option 2: Manual startup

1. **Start the backend server (in a new terminal):**

   ```bash
   cd staybuddy/server
   pip install -r requirements.txt
   python app.py
   ```

   You should see: `Running on http://127.0.0.1:5000`

2. **The frontend is already running on port 3000** ✅

### Verification

Once both servers are running:

- Frontend: http://localhost:3000 ✅ (already running)
- Backend: http://localhost:5000 ❌ (needs to be started)

When both are running, the proxy errors will disappear and forms will work correctly.

### Note

The "body stream already read" error will also disappear once the backend is running, as it's caused by network failures when the backend is unavailable.
