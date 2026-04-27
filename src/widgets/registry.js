import { lazy } from 'react';

/**
 * Widget Registry — maps viz_type strings to lazily-loaded widget components.
 * 
 * Each entry defines:
 * - component: lazy-loaded React component
 * - label: human-readable name for the widget
 * - icon: Lucide icon name
 * - defaultSpan: default grid column span (out of 12)
 * - defaultHeight: default grid row span
 * - category: grouping for the widget picker
 */
const registry = {
  /* ── Charts ───────────────────────────────── */
  chart: {
    component: lazy(() => import('../widgets/ChartWidget/ChartWidget')),
    label: 'Chart',
    icon: 'BarChart3',
    defaultSpan: 6,
    defaultHeight: 4,
    category: 'Charts',
  },

  /* ── Tables ───────────────────────────────── */
  table: {
    component: lazy(() => import('../widgets/TableWidget/TableWidget')),
    label: 'Data Table',
    icon: 'Table',
    defaultSpan: 12,
    defaultHeight: 5,
    category: 'Data',
  },

  /* ── KPI ─────────────────────────────────── */
  kpi_grid: {
    component: lazy(() => import('../widgets/KPIWidget/KPIWidget')),
    label: 'KPI Cards',
    icon: 'TrendingUp',
    defaultSpan: 12,
    defaultHeight: 2,
    category: 'Metrics',
  },

  /* ── Markdown ─────────────────────────────── */
  markdown: {
    component: lazy(() => import('../widgets/MarkdownWidget/MarkdownWidget')),
    label: 'Markdown',
    icon: 'FileText',
    defaultSpan: 6,
    defaultHeight: 4,
    category: 'Content',
  },

  /* ── Stat Summary ─────────────────────────── */
  stat_summary: {
    component: lazy(() => import('../widgets/StatSummaryWidget/StatSummaryWidget')),
    label: 'Statistical Summary',
    icon: 'Calculator',
    defaultSpan: 12,
    defaultHeight: 3,
    category: 'Analytics',
  },

  /* ── Spatial ──────────────────────────────── */
  geo_map: {
    component: lazy(() => import('../widgets/GeoMapWidget/GeoMapWidget')),
    label: 'Geo Map',
    icon: 'Map',
    defaultSpan: 6,
    defaultHeight: 4,
    category: 'Spatial',
  },

  /* ── Ad-hoc Analysis ──────────────────────── */
  pivot_table: {
    component: lazy(() => import('../widgets/PivotTableWidget/PivotTableWidget')),
    label: 'Pivot Table',
    icon: 'TableProperties',
    defaultSpan: 12,
    defaultHeight: 5,
    category: 'Analytics',
  },
};

/**
 * Enterprise & Extensibility: Custom Widget Plugin System
 * Exposes a global API so users can inject custom React components 
 * without modifying the core platform code.
 */
if (typeof window !== 'undefined') {
  window.AgentViz = window.AgentViz || {};
  window.AgentViz.registerWidget = (type, definition) => {
    registry[type] = {
      ...definition,
      // Default fallback values
      defaultSpan: definition.defaultSpan || 6,
      defaultHeight: definition.defaultHeight || 4,
      category: definition.category || 'Custom Plugins'
    };
    console.log(`[AgentViz] Successfully registered custom widget plugin: ${type}`);
  };
}

/**
 * Get a widget definition by viz_type.
 * @param {string} vizType
 * @returns {object|null}
 */
export function getWidget(vizType) {
  return registry[vizType] || null;
}

/**
 * Get all registered widget types.
 * @returns {Array<{type: string, label: string, icon: string, category: string}>}
 */
export function getAllWidgets() {
  return Object.entries(registry).map(([type, def]) => ({
    type,
    label: def.label,
    icon: def.icon,
    category: def.category,
  }));
}

/**
 * Check if a viz_type is supported.
 * @param {string} vizType
 * @returns {boolean}
 */
export function isSupported(vizType) {
  return vizType in registry;
}

export default registry;
