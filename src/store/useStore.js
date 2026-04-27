import { create } from 'zustand';

/**
 * Global application store using Zustand.
 * Manages theme, sidebar state, widgets, dashboard, and WebSocket connection.
 */
export const useStore = create((set, get) => ({
  /* ── Theme ─────────────────────────────────────────── */
  theme: localStorage.getItem('agent-viz-theme') || 'dark',
  setTheme: (theme) => {
    localStorage.setItem('agent-viz-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },

  /* ── Sidebar ───────────────────────────────────────── */
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  /* ── Active View ─────────────────────────────────── */
  activeView: 'dashboard',
  setActiveView: (view) => set({ activeView: view }),

  /* ── Connection ────────────────────────────────────── */
  connected: false,
  setConnected: (connected) => set({ connected }),

  /* ── Agent Responses ───────────────────────────────── */
  responses: [],
  addResponse: (response) =>
    set((s) => ({
      responses: [response, ...s.responses].slice(0, 100),
    })),
  clearResponses: () => set({ responses: [] }),

  /* ── Dashboard ─────────────────────────────────────── */
  dashboardWidgets: [],
  dashboardLayout: [],
  setDashboard: (widgets, layout) =>
    set({ dashboardWidgets: widgets, dashboardLayout: layout }),
  addDashboardWidget: (widget) =>
    set((s) => ({
      dashboardWidgets: [...s.dashboardWidgets, widget],
      dashboardLayout: [
        ...s.dashboardLayout,
        {
          i: widget.id,
          x: (s.dashboardLayout.length * 4) % 12,
          y: Infinity,
          w: widget.span || 6,
          h: widget.height || 4,
          minW: 3,
          minH: 2,
        },
      ],
    })),
  removeDashboardWidget: (id) =>
    set((s) => ({
      dashboardWidgets: s.dashboardWidgets.filter((w) => w.id !== id),
      dashboardLayout: s.dashboardLayout.filter((l) => l.i !== id),
    })),
  updateLayout: (layout) => set({ dashboardLayout: layout }),

  shareDashboard: () => {
    const { dashboardWidgets, dashboardLayout, globalFilters } = get();
    const stateToSave = {
      dashboardWidgets: dashboardWidgets.map(({ id, viz_type, viz_config, agent_id, data, span, height }) => ({ id, viz_type, viz_config, agent_id, data, span, height })),
      dashboardLayout,
      globalFilters
    };
    try {
      const b64 = btoa(encodeURIComponent(JSON.stringify(stateToSave)));
      const url = new URL(window.location.href);
      url.hash = `share=${b64}`;
      return url.toString();
    } catch (e) {
      console.error('Failed to serialize dashboard', e);
      return '';
    }
  },

  loadDashboardFromUrl: () => {
    try {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#share=')) {
        const b64 = hash.replace('#share=', '');
        const decoded = JSON.parse(decodeURIComponent(atob(b64)));
        if (decoded.dashboardWidgets) {
          set({ 
            dashboardWidgets: decoded.dashboardWidgets,
            dashboardLayout: decoded.dashboardLayout || [],
            globalFilters: decoded.globalFilters || {},
            activeView: 'dashboard'
          });
          // Remove hash
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    } catch (e) {
      console.error('Failed to parse shared dashboard URL', e);
    }
  },

  /* ── Global Filters ────────────────────────────────── */
  globalFilters: {},
  setGlobalFilter: (field, value) =>
    set((s) => ({
      globalFilters: { ...s.globalFilters, [field]: value },
    })),
  clearGlobalFilters: () => set({ globalFilters: {} }),
}));
