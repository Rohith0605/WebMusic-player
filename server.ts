import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";
import events from "events";

// Increase max listeners to mitigate TLSSocket warning in dev environment
events.EventEmitter.defaultMaxListeners = 25;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Shared axios instance with timeout
const apiClient = axios.create({
  timeout: 10000,
});

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/tracks", async (req, res) => {
    try {
      // Deezer chart endpoint for trending tracks
      const response = await apiClient.get("https://api.deezer.com/chart");
      res.json(response.data);
    } catch (error: any) {
      console.error("Deezer API Error:", error.message);
      res.status(500).json({ error: "Failed to fetch tracks" });
    }
  });

  app.get("/api/search", async (req, res) => {
    const { q } = req.query;
    try {
      const response = await apiClient.get(`https://api.deezer.com/search?q=${encodeURIComponent(String(q ?? ""))}`);
      res.json(response.data);
    } catch (error: any) {
      console.error("Search API Error:", error.message);
      res.status(500).json({ error: "Search failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
