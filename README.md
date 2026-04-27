# Wizcraft AgentViz Platform MVP

A comprehensive, Micro-Frontend (MFE) architecture built to dynamically render React dashboards, 20+ intricate charts, 3D visualizations, and interactive pivot tables based entirely on intelligent AI agent payloads.

## 🚀 The AI-Centric Advantage
Traditional dashboards require manual configuration and rigid data pipelines. **Wizcraft** is built for the autonomous AI era. You construct your statistical algorithms inside backend runtimes (using tools like LangGraph + Pandas), and your AI agent automatically dispatches standardized `viz_config` JSON payloads to the frontend over WebSockets. The platform intercepts these configuration packets and generates beautifully scaled, interactive charts instantly.

---

## 🏗️ Technical Capabilities & Features

### 1. Robust Visualization Engine (ECharts & GL)
- Supported natively: **Bar, Area, Pie, Heatmaps, Scatter, Funnels, Radars** and more out of the box using Apache ECharts.
- Included **3D Spatial Mapping** utilizing `echarts-gl` mapped to standard agent payload requests (specifically designed for dense vectors and Embeddings).

### 2. Multi-Agent Grid & Pivot Tooling
- **Pivot Tables**: Integrated `react-pivottable` allows users to interact organically with complex JSON payloads, rendering ad-hoc multidimensional analysis with Drag-and-Drop operations on the fly.
- **Parallel Context Canvas**: The system detects incoming parameters via an `agent_id` property, immediately clustering responses visually into parallel columns to accommodate multiple conversational agents rendering streams simultaneously. 

### 3. Advanced Statistical Operations
- **Data Ingestion API**: Provides an HTTP interface inside the Header for end-users to securely pass dense CSV/JSON chunks upstream.
- **Native NLP Chatbot**: Float queries universally throughout the Playground and Dashboard utilizing the NLP query bar module.
- **Event-Driven Filtering**: Features universal Cross-Filtering across charts via the custom Event Bus, and drill-down socket events (`user:action`) fired when users click on visual elements to trigger recursive Agent workflows.

### 4. Platform Extensibility
- **Dashboard Serialisation**: Clicking the Share URL link serializes your complete customized widget layout down to a Base64 string on the hash index. Anyone pasting the URL loads your layout identically instantly.
- **Custom Widget Registration API**: The global DOM carries a `window.AgentViz.registerWidget(type, Component)` wrapper inside the registry. Developers can write independent React plugins locally and hook them into Wizcraft natively.
- **Exporting Modules**: All widget wrapper cards natively support standard Export commands: Canvas generation to PNG or Dataset parsing into CSV downloads.

---

## 🛠️ Step-by-Step Installation

### Booting the Development Environment

1. **Install Core Engine Modules**
   ```bash
   git clone https://github.com/Aditya148/wizcraft.git
   cd wizcraft
   npm install
   ```

2. **Start the Agent Socket Gateway** (Runs background routing on default Port 4000)
   ```bash
   npm run server
   ```

3. **Start the Single Page Application UI**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to interact with the environment.

### Integrating the Python / LangGraph Agents
Wizcraft utilizes secure socket pipes. Check the Python reference script to understand how simple it is to deploy graphical interfaces.
```bash
# Setup up your python virtual environment
pip install -r requirements.txt

# Execute the sample push triggers
jupyter notebook langgraph_agent_example.ipynb
```

---

## 📝 License
Protected inherently under the **MIT License**. For complete usage constraints, view the included LICENSE file inside the repository tree.
