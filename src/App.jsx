import { useEffect, useState, Suspense } from 'react';
import { useStore } from './store/useStore';
import { socketService } from './services/socketService';
import { getWidget, getAllWidgets } from './widgets/registry';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import DashboardView from './views/DashboardView/DashboardView';
import WidgetWrapper from './components/WidgetWrapper/WidgetWrapper';
import {
  DEMO_BAR_RESPONSE,
  DEMO_LINE_RESPONSE,
  DEMO_PIE_RESPONSE,
  DEMO_SCATTER_RESPONSE,
  DEMO_TABLE_RESPONSE,
  DEMO_RADAR_RESPONSE,
  DEMO_HEATMAP_RESPONSE,
  DEMO_STAT_RESPONSE,
  DEMO_KPI_RESPONSE,
} from './data/demoData';
import {
  BarChart3,
  Table,
  TrendingUp,
  FileText,
  Calculator,
  PieChart,
  ScatterChart,
  Activity,
  Send,
  Sparkles,
} from 'lucide-react';
import styles from './App.module.css';

/* Collect demo responses for the playground feed */
const PLAYGROUND_DEMOS = [
  DEMO_KPI_RESPONSE,
  DEMO_BAR_RESPONSE,
  DEMO_LINE_RESPONSE,
  DEMO_PIE_RESPONSE,
  DEMO_SCATTER_RESPONSE,
  DEMO_TABLE_RESPONSE,
  DEMO_RADAR_RESPONSE,
  DEMO_HEATMAP_RESPONSE,
  DEMO_STAT_RESPONSE,
];

/* Widget descriptions for the explorer view */
const WIDGET_CATALOG = [
  { type: 'chart', icon: BarChart3, title: 'Adaptive Chart', desc: 'Supports bar, line, area, pie, scatter, histogram, heatmap, radar, funnel, gauge, treemap, sunburst, sankey, candlestick, box plot, and more.', badge: '20+ types' },
  { type: 'table', icon: Table, title: 'Data Table', desc: 'Interactive sortable, filterable, paginated table with auto-detected numeric columns.', badge: 'Interactive' },
  { type: 'kpi_grid', icon: TrendingUp, title: 'KPI Cards', desc: 'Big numbers with trend badges, sparklines, and staggered animations.', badge: 'Metrics' },
  { type: 'markdown', icon: FileText, title: 'Markdown Renderer', desc: 'Rich GFM markdown with syntax highlighting, tables, and collapsible sections.', badge: 'Content' },
  { type: 'stat_summary', icon: Calculator, title: 'Statistical Summary', desc: 'Descriptive statistics — mean, median, std, quartiles, skewness, kurtosis.', badge: 'Analytics' },
];

export default function App() {
  const { activeView, setTheme, theme, responses, addResponse, loadDashboardFromUrl } = useStore();
  const [query, setQuery] = useState('');

  /* Apply persisted theme on mount and attempt socket connection */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    socketService.connect();
    loadDashboardFromUrl();
    return () => socketService.disconnect();
  }, []);

  /* Playground: simulate sending a query */
  const handleSend = () => {
    if (!query.trim()) return;
    /* Pick a random demo response to simulate agent reply */
    const demo = PLAYGROUND_DEMOS[Math.floor(Math.random() * PLAYGROUND_DEMOS.length)];
    const response = {
      ...demo,
      id: `resp-${Date.now()}`,
      timestamp: new Date().toISOString(),
      text_summary: `Response to: "${query}" — ${demo.text_summary}`,
    };
    addResponse(response);
    setQuery('');
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;

      case 'explorer':
        return (
          <div className={styles.explorerView}>
            {WIDGET_CATALOG.map((w, i) => {
              const IconComp = w.icon;
              return (
                <div
                  key={w.type}
                  className={styles.explorerCard}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className={styles.explorerCardIcon}>
                    <IconComp size={24} />
                  </div>
                  <div className={styles.explorerCardTitle}>{w.title}</div>
                  <div className={styles.explorerCardDesc}>{w.desc}</div>
                  <span className={styles.explorerCardBadge}>{w.badge}</span>
                </div>
              );
            })}
          </div>
        );

      case 'playground':
        return (
          <div className={styles.playgroundView}>
            <div className={styles.playgroundHeader}>
              <h1 className={styles.playgroundTitle}>
                <Sparkles size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: 'var(--color-accent)' }} />
                Agent Playground
              </h1>
            </div>
            <div className={styles.queryBar}>
              <input
                className={styles.queryInput}
                placeholder="Ask the agent anything… e.g. 'Show me revenue by region'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                id="query-input"
              />
              <button className={styles.sendBtn} onClick={handleSend} id="send-query">
                <Send size={16} />
                Send
              </button>
            </div>
            <div className={styles.responseList}>
              {responses.map((resp) => {
                const def = getWidget(resp.viz_type);
                if (!def) return null;
                const WidgetComponent = def.component;
                return (
                  <div key={resp.id} className={styles.responseItem}>
                    <WidgetWrapper
                      title={resp.viz_config?.title || def.label}
                      subtitle={`${resp.agent_id} • ${new Date(resp.timestamp).toLocaleTimeString()}`}
                      data={resp.data}
                    >
                      <Suspense fallback={<div>Loading…</div>}>
                        <WidgetComponent vizConfig={resp.viz_config || {}} data={resp.data} />
                      </Suspense>
                      {resp.text_summary && (
                        <p style={{
                          marginTop: 'var(--space-3)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--color-text-secondary)',
                          fontStyle: 'italic',
                        }}>
                          💡 {resp.text_summary}
                        </p>
                      )}
                    </WidgetWrapper>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'live':
        return (
          <div className={styles.playgroundView}>
            <div className={styles.playgroundHeader}>
              <h1 className={styles.playgroundTitle}>
                <Activity size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: 'var(--color-accent)' }} />
                Live Feed
              </h1>
            </div>
            <div className={styles.responseList}>
              {responses.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', padding: '80px 0' }}>
                  <Activity size={40} style={{ opacity: 0.3, marginBottom: 16 }} />
                  <p>Waiting for agent responses…</p>
                  <p style={{ fontSize: 'var(--text-xs)', marginTop: 8 }}>Connect an agent via WebSocket on port 4000</p>
                </div>
              ) : (() => {
                  const agents = Array.from(new Set(responses.map(r => r.agent_id || 'Unknown Agent')));
                  const renderResponse = (resp) => {
                    const def = getWidget(resp.viz_type);
                    if (!def) return null;
                    const WidgetComponent = def.component;
                    return (
                      <div key={resp.id} className={styles.responseItem}>
                        <WidgetWrapper
                          title={resp.viz_config?.title || def.label}
                          subtitle={`${resp.agent_id} • ${new Date(resp.timestamp).toLocaleTimeString()}`}
                          data={resp.data}
                        >
                          <Suspense fallback={<div>Loading…</div>}>
                            <WidgetComponent vizConfig={resp.viz_config || {}} data={resp.data} />
                          </Suspense>
                        </WidgetWrapper>
                      </div>
                    );
                  };

                  if (agents.length <= 1) {
                    return responses.map(renderResponse);
                  }

                  return (
                    <div className={styles.multiAgentCanvas}>
                      {agents.map(agentId => (
                        <div key={agentId} className={styles.agentColumn}>
                          <h3 className={styles.agentFeedTitle}>
                            <Activity size={14} style={{ display: 'inline', marginRight: 6 }} />
                            {agentId}
                          </h3>
                          <div className={styles.responseList}>
                            {responses.filter(r => (r.agent_id || 'Unknown Agent') === agentId).map(renderResponse)}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()
              }
            </div>
          </div>
        );

      default:
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-tertiary)' }}>
            <p>View "{activeView}" coming soon…</p>
          </div>
        );
    }
  };

  return (
    <>
      <Header />
      <div className={styles.appLayout}>
        <Sidebar />
        <main className={styles.mainContent}>
          {renderView()}
        </main>
      </div>
    </>
  );
}
