## How to run

npm install
npm run dev


App runs on `http://localhost:3000`.

## Architecture decisions

### Why Socket.io over raw WebSockets?

Tried to keep it simple. Socket.io gives me reconnection, rooms and event-based messaging out of the box. With raw WS I'd spend half the time writing retry logic and message parsing. For a typing game where every keystroke matters, reliable connection is key.

### Why custom server instead of Next.js API routes?

Next.js API routes are serverless/request-response by nature - they don't support persistent WebSocket connections. So I went with a custom Node HTTP server that runs Next.js and Socket.io on the same port. One process, no CORS headaches, simple deploy.

### Why JSON file for persistence?

It's a recruitment exercise, not a production app. SQLite or Postgres would be overkill here. JSON file does the job 

### Why no separate REST API for game state?

Everything goes through WebSocket. Adding REST endpoints would mean two sources of truth. Socket.io already handles the initial state sync on connection

### Project structure

Nothing fancy. server/ has the backend, app/ has Next.js pages, components/ and hooks/ have the frontend stuff, lib/ has shared code between client and server. Tried to keep it flat - no nested folders for the sake of nesting.
