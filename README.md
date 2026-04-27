# Wizcraft AgentViz Platform MVP

A powerful, Micro-Frontend (MFE) architecture built to dynamically render React dashboards, 20+ charts, 3D visualizations, and pivot tables based entirely on intelligent AI agent payloads.

## Features Currently Implemented
- **20+ Chart Options**: Render area, bar, scatter, pie, heatmap, and more through Apache ECharts.
- **Statistical Intelligence**: Ingest datasets, generate natural language queries via a floating chat UI, and watch the platform auto-profile correlation matrices and regressions.
- **Enterprise Extensibility**: Drag-and-drop Pivot tables, multi-agent parallel Live Feeds, and a `window.AgentViz.registerWidget` Plugin API.
- **Dashboard Serialisation**: Export widget data to native CSV or PNG images, and serialize your exact layout to Base64 to share active views via URL.

## Getting Started

To launch the project locally:

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Agent Gateway server (Data Stream + WebSockets)**
   ```bash
   npm run server
   ```

3. **Start the Vite UI Dev Server**
   ```bash
   npm run dev
   ```

Open `http://localhost:3000` to interact with the visual platform.

## Agent Compatibility
Included is a `langgraph_agent_example.ipynb` referencing how a Python-driven LangGraph architecture can safely intercept UI drill-down interactions and post custom visualization JSON Payloads over standard HTTP protocols.
