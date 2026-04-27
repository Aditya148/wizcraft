/**
 * Sample agent payloads showcasing every widget type.
 * Used for the demo/playground view and initial dashboard population.
 */

export const DEMO_KPI_RESPONSE = {
  id: 'demo-kpi-001',
  agent_id: 'analytics-agent',
  timestamp: new Date().toISOString(),
  viz_type: 'kpi_grid',
  viz_config: { title: 'Performance Overview' },
  data: [
    { label: 'Total Revenue', value: '$2.4M', change: '+12.5%', trend: 'up', sparkline: [18, 22, 19, 28, 25, 32, 30, 38, 35, 42, 40, 48] },
    { label: 'Active Users', value: '184K', change: '+8.2%', trend: 'up', sparkline: [120, 125, 118, 135, 140, 155, 148, 162, 170, 168, 178, 184] },
    { label: 'Conversion Rate', value: '3.24%', change: '-0.3%', trend: 'down', sparkline: [3.8, 3.5, 3.2, 3.6, 3.4, 3.1, 3.3, 3.2, 3.5, 3.1, 3.3, 3.24] },
    { label: 'Avg Session', value: '4m 32s', change: '+15s', trend: 'up', sparkline: [220, 235, 240, 248, 255, 260, 258, 265, 270, 268, 272, 272] },
  ],
  text_summary: 'Revenue is up 12.5% MoM. Active users grew steadily.',
};

export const DEMO_BAR_RESPONSE = {
  id: 'demo-bar-001',
  agent_id: 'analytics-agent',
  timestamp: new Date().toISOString(),
  viz_type: 'chart',
  viz_config: {
    chart_type: 'bar',
    title: 'Revenue by Region',
    x_axis: 'region',
    y_axis: 'revenue',
  },
  data: [
    { region: 'North America', revenue: 842000 },
    { region: 'Europe', revenue: 654000 },
    { region: 'Asia Pacific', revenue: 528000 },
    { region: 'Latin America', revenue: 245000 },
    { region: 'Middle East', revenue: 131000 },
  ],
  text_summary: 'North America leads with $842K in revenue.',
};

export const DEMO_LINE_RESPONSE = {
  id: 'demo-line-001',
  agent_id: 'analytics-agent',
  timestamp: new Date().toISOString(),
  viz_type: 'chart',
  viz_config: {
    chart_type: 'area',
    title: 'Monthly Revenue Trend',
    x_axis: 'month',
    y_axis: 'revenue',
    color: 'product',
  },
  data: [
    { month: 'Jan', revenue: 42000, product: 'Product A' },
    { month: 'Feb', revenue: 58000, product: 'Product A' },
    { month: 'Mar', revenue: 65000, product: 'Product A' },
    { month: 'Apr', revenue: 72000, product: 'Product A' },
    { month: 'May', revenue: 85000, product: 'Product A' },
    { month: 'Jun', revenue: 92000, product: 'Product A' },
    { month: 'Jan', revenue: 28000, product: 'Product B' },
    { month: 'Feb', revenue: 34000, product: 'Product B' },
    { month: 'Mar', revenue: 42000, product: 'Product B' },
    { month: 'Apr', revenue: 48000, product: 'Product B' },
    { month: 'May', revenue: 56000, product: 'Product B' },
    { month: 'Jun', revenue: 62000, product: 'Product B' },
  ],
  text_summary: 'Both products show consistent upward trend. Product A leads.',
};

export const DEMO_PIE_RESPONSE = {
  id: 'demo-pie-001',
  agent_id: 'analytics-agent',
  timestamp: new Date().toISOString(),
  viz_type: 'chart',
  viz_config: {
    chart_type: 'donut',
    title: 'Traffic Sources',
    category: 'source',
    value: 'visits',
  },
  data: [
    { source: 'Organic Search', visits: 4520 },
    { source: 'Direct', visits: 3200 },
    { source: 'Social Media', visits: 2100 },
    { source: 'Referral', visits: 1680 },
    { source: 'Email', visits: 920 },
    { source: 'Paid Ads', visits: 780 },
  ],
  text_summary: 'Organic search drives 34% of total traffic.',
};

export const DEMO_SCATTER_RESPONSE = {
  id: 'demo-scatter-001',
  agent_id: 'analytics-agent',
  timestamp: new Date().toISOString(),
  viz_type: 'chart',
  viz_config: {
    chart_type: 'scatter',
    title: 'Price vs Rating',
    x_axis: 'price',
    y_axis: 'rating',
  },
  data: Array.from({ length: 50 }, (_, i) => ({
    price: Math.round(10 + Math.random() * 190),
    rating: +(1 + Math.random() * 4).toFixed(1),
  })),
  text_summary: 'No strong correlation between price and rating observed.',
};

export const DEMO_TABLE_RESPONSE = {
  id: 'demo-table-001',
  agent_id: 'data-agent',
  timestamp: new Date().toISOString(),
  viz_type: 'table',
  viz_config: {
    title: 'Top Products by Revenue',
    columns: ['product', 'category', 'revenue', 'units', 'margin'],
  },
  data: [
    { product: 'Widget Pro X', category: 'Electronics', revenue: 284500, units: 1230, margin: 32.4 },
    { product: 'CloudSync Plus', category: 'Software', revenue: 198000, units: 890, margin: 78.2 },
    { product: 'DataVault Enterprise', category: 'Software', revenue: 175000, units: 245, margin: 82.1 },
    { product: 'SensorMax IoT', category: 'Hardware', revenue: 156000, units: 680, margin: 28.5 },
    { product: 'SecureNet VPN', category: 'Security', revenue: 142000, units: 3200, margin: 65.8 },
    { product: 'AI Assistant Pro', category: 'AI/ML', revenue: 128000, units: 560, margin: 72.3 },
    { product: 'PowerGrid Adapter', category: 'Hardware', revenue: 115000, units: 2100, margin: 24.8 },
    { product: 'StreamFlow CDN', category: 'Infrastructure', revenue: 98000, units: 180, margin: 55.2 },
    { product: 'QuantumDB', category: 'Database', revenue: 87000, units: 120, margin: 68.9 },
    { product: 'PixelForge Suite', category: 'Creative', revenue: 76000, units: 340, margin: 61.4 },
  ],
  text_summary: 'Widget Pro X leads with $284.5K in revenue.',
};

export const DEMO_RADAR_RESPONSE = {
  id: 'demo-radar-001',
  agent_id: 'analytics-agent',
  timestamp: new Date().toISOString(),
  viz_type: 'chart',
  viz_config: {
    chart_type: 'radar',
    title: 'Product Comparison',
    category: 'name',
  },
  data: [
    { name: 'Product A', Performance: 85, Reliability: 90, UX: 78, Price: 65, Support: 92 },
    { name: 'Product B', Performance: 72, Reliability: 85, UX: 92, Price: 88, Support: 76 },
  ],
  text_summary: 'Product A excels in reliability and support, while Product B wins on UX and price.',
};

export const DEMO_STAT_RESPONSE = {
  id: 'demo-stat-001',
  agent_id: 'analytics-agent',
  timestamp: new Date().toISOString(),
  viz_type: 'stat_summary',
  viz_config: { title: 'Dataset Statistics' },
  data: {
    columns: [
      { name: 'Revenue', count: 1200, mean: 45230.5, median: 42000, std: 15800.2, min: 12000, max: 128000, q1: 32000, q3: 56000, skew: 0.84, kurtosis: 0.32 },
      { name: 'Units Sold', count: 1200, mean: 856, median: 780, std: 420, min: 45, max: 3200, q1: 520, q3: 1100, skew: 1.2, kurtosis: 1.8 },
    ],
  },
  text_summary: 'Revenue is right-skewed with mean $45.2K. Units sold has higher variance.',
};

export const DEMO_HEATMAP_RESPONSE = {
  id: 'demo-heatmap-001',
  agent_id: 'analytics-agent',
  timestamp: new Date().toISOString(),
  viz_type: 'chart',
  viz_config: {
    chart_type: 'heatmap',
    title: 'Correlation Matrix',
    x_axis: 'x',
    y_axis: 'y',
    value: 'correlation',
  },
  data: [
    { x: 'Revenue', y: 'Revenue', correlation: 1.0 },
    { x: 'Revenue', y: 'Users', correlation: 0.82 },
    { x: 'Revenue', y: 'Sessions', correlation: 0.75 },
    { x: 'Revenue', y: 'Bounce Rate', correlation: -0.45 },
    { x: 'Users', y: 'Revenue', correlation: 0.82 },
    { x: 'Users', y: 'Users', correlation: 1.0 },
    { x: 'Users', y: 'Sessions', correlation: 0.91 },
    { x: 'Users', y: 'Bounce Rate', correlation: -0.38 },
    { x: 'Sessions', y: 'Revenue', correlation: 0.75 },
    { x: 'Sessions', y: 'Users', correlation: 0.91 },
    { x: 'Sessions', y: 'Sessions', correlation: 1.0 },
    { x: 'Sessions', y: 'Bounce Rate', correlation: -0.52 },
    { x: 'Bounce Rate', y: 'Revenue', correlation: -0.45 },
    { x: 'Bounce Rate', y: 'Users', correlation: -0.38 },
    { x: 'Bounce Rate', y: 'Sessions', correlation: -0.52 },
    { x: 'Bounce Rate', y: 'Bounce Rate', correlation: 1.0 },
  ],
  text_summary: 'Strong positive correlation between Users and Sessions (0.91). Bounce Rate negatively correlated with all metrics.',
};

/* The default demo dashboard layout */
export const DEMO_DASHBOARD = {
  widgets: [
    { ...DEMO_KPI_RESPONSE, id: 'w-kpi', span: 12, height: 2 },
    { ...DEMO_LINE_RESPONSE, id: 'w-area', span: 8, height: 4 },
    { ...DEMO_PIE_RESPONSE, id: 'w-donut', span: 4, height: 4 },
    { ...DEMO_BAR_RESPONSE, id: 'w-bar', span: 6, height: 4 },
    { ...DEMO_HEATMAP_RESPONSE, id: 'w-heatmap', span: 6, height: 4 },
    { ...DEMO_TABLE_RESPONSE, id: 'w-table', span: 12, height: 5 },
    { ...DEMO_RADAR_RESPONSE, id: 'w-radar', span: 6, height: 4 },
    { ...DEMO_STAT_RESPONSE, id: 'w-stat', span: 6, height: 3 },
  ],
  layout: [
    { i: 'w-kpi', x: 0, y: 0, w: 12, h: 2, minW: 6, minH: 2 },
    { i: 'w-area', x: 0, y: 2, w: 8, h: 4, minW: 4, minH: 3 },
    { i: 'w-donut', x: 8, y: 2, w: 4, h: 4, minW: 3, minH: 3 },
    { i: 'w-bar', x: 0, y: 6, w: 6, h: 4, minW: 3, minH: 3 },
    { i: 'w-heatmap', x: 6, y: 6, w: 6, h: 4, minW: 3, minH: 3 },
    { i: 'w-table', x: 0, y: 10, w: 12, h: 5, minW: 6, minH: 3 },
    { i: 'w-radar', x: 0, y: 15, w: 6, h: 4, minW: 3, minH: 3 },
    { i: 'w-stat', x: 6, y: 15, w: 6, h: 3, minW: 3, minH: 2 },
  ],
};
