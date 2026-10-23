🎵 WebMusic Player

Discover music. Explore tracks. Enjoy the sound.

WebMusic Player is a web-based music discovery and preview application that allows users to explore trending tracks, search for songs, listen to available previews, and organize their favorite music in one place.

Built with React, TypeScript, and Vite, the project combines a modern frontend with an Express backend to retrieve music data from the Deezer API.

✨ Features

- Trending Music: Explore popular tracks using music chart data.
- Music Search: Search for tracks and discover new music.
- Audio Previews: Listen to available song previews directly in the browser.
- Favorites: Save tracks you enjoy for easier access.
- Playlists: Organize music into personal playlists.
- Responsive Interface: Browse the application across different screen sizes.
- Backend API: Retrieve music data through Express endpoints.

Feature availability depends on the current implementation and the external music API.

🛠️ Tech Stack

Technology| Purpose
React| Building the user interface
TypeScript| Type-safe application development
Vite| Development server and frontend build tool
Tailwind CSS| Styling and responsive layouts
Node.js| JavaScript runtime
Express.js| Backend server and API routes
Axios| HTTP requests to external services
Deezer API| Music charts, search results, and preview data
React Router| Client-side page navigation
Howler.js| Audio playback support

📁 Project Structure

WebMusic-player/
├── src/
│   ├── components/    # Reusable UI components
│   ├── context/       # Shared application state
│   ├── pages/         # Home, Search, Favorites, Playlists
│   ├── services/      # API communication
│   ├── App.tsx        # Application routes
│   ├── main.tsx       # Frontend entry point
│   ├── index.css      # Global styles
│   └── types.ts       # TypeScript definitions
├── index.html
├── server.ts          # Express backend
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts

🚀 Getting Started

Prerequisites

Install the following before running the project:

- "Node.js" (https://nodejs.org/) (a compatible LTS version)
- npm, which comes with Node.js
- Git

1. Clone the repository

git clone https://github.com/Rohith0605/WebMusic-player.git
cd WebMusic-player

2. Install dependencies

npm install

3. Start the development server

npm run dev

Open the local address displayed in your terminal to access the application. The current server configuration uses port "3000".

4. Build the frontend

npm run build

Vite generates the production frontend files in the "dist/" directory.

🔌 API Endpoints

The Express backend provides the following endpoints:

Method| Endpoint| Description
GET| "/api/tracks"| Retrieves trending music chart data
GET| "/api/search?q=..."| Searches for tracks matching a query

These endpoints retrieve data from the Deezer API. Their availability depends on the external service and network connectivity.

🌐 Deployment

WebMusic Player can be deployed to a Node.js-compatible hosting platform such as "Render" (https://render.com/).

The deployment must support both the Vite-built frontend and the Express backend. Configure the production build and start commands according to the project's server setup, and ensure the server listens on the hosting platform's assigned port.

🔮 Future Improvements

- Improve audio playback controls and queue management.
- Add shuffle, repeat, and playback progress controls.
- Enhance playlist creation and editing.
- Improve loading states and error handling.
- Add automated tests and production monitoring.
- Improve accessibility and mobile usability.

📌 Project Status

WebMusic Player is a prototype project intended for learning and experimentation with frontend development, backend APIs, and music-related web applications.

👨‍💻 Author

Gundlapally Rohith Kumar

GitHub: "@Rohith0605" (https://github.com/Rohith0605)

📄 License

This project currently does not specify a repository license. Add a license file if you intend to publish the project for reuse or distribution.

---

Built as a learning project exploring modern web development and music discovery.
