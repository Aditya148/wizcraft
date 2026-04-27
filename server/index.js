import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 4000;

/* ── HTTP Server ──────────────────────────────────────────── */
const httpServer = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    return;
  }

  if (req.method === 'POST' && req.url === '/api/push') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const eventType = payload.type === 'dashboard' ? 'agent:dashboard' : 'agent:response';
        io.emit(eventType, payload);

        res.writeHead(200);
        res.end(JSON.stringify({ ok: true, clients: clients.size }));
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

/* ── Socket.IO Server ─────────────────────────────────────── */
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

/* Track connected clients */
const clients = new Map();

io.on('connection', (socket) => {
  console.log(`[Gateway] Client connected: ${socket.id}`);
  clients.set(socket.id, { connectedAt: new Date(), id: socket.id });

  /* Handle user queries from the MFE */
  socket.on('user:query', (payload) => {
    console.log(`[Gateway] Query from ${socket.id}:`, payload.query);

    /*
     * In production, this is where you'd route the query to an AI agent:
     *   1. Forward to the appropriate agent (Python, LLM API, etc.)
     *   2. Agent processes & returns structured viz payload
     *   3. Gateway emits the response back to the client
     *
     * For now, we echo back a demo response.
     */
    const demoResponse = {
      id: `resp-${Date.now()}`,
      agent_id: 'demo-agent',
      timestamp: new Date().toISOString(),
      viz_type: 'chart',
      viz_config: {
        chart_type: 'bar',
        title: `Results for: "${payload.query}"`,
        x_axis: 'category',
        y_axis: 'value',
      },
      data: [
        { category: 'Alpha', value: Math.round(Math.random() * 100) },
        { category: 'Beta', value: Math.round(Math.random() * 100) },
        { category: 'Gamma', value: Math.round(Math.random() * 100) },
        { category: 'Delta', value: Math.round(Math.random() * 100) },
        { category: 'Epsilon', value: Math.round(Math.random() * 100) },
      ],
      text_summary: `Agent analyzed "${payload.query}" and generated a visualization.`,
    };

    socket.emit('agent:response', demoResponse);
  });

  /* Handle user actions (button clicks from widgets) */
  socket.on('user:action', (action) => {
    console.log(`[Gateway] Action from ${socket.id}:`, action);
    // Route to the appropriate agent for follow-up processing
  });

  /* Disconnect */
  socket.on('disconnect', (reason) => {
    console.log(`[Gateway] Client disconnected: ${socket.id} (${reason})`);
    clients.delete(socket.id);
  });
});

/* ── Start ────────────────────────────────────────────────── */
httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║  🚀 AgentViz Gateway Server                  ║
║  Running on http://localhost:${PORT}            ║
║                                               ║
║  WebSocket:  ws://localhost:${PORT}             ║
║  Health:     http://localhost:${PORT}/health     ║
║  Push API:   POST http://localhost:${PORT}/api/push ║
╚═══════════════════════════════════════════════╝
  `);
});
