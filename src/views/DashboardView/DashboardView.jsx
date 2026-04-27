import { useEffect, useState, Suspense } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useStore } from '../../store/useStore';
import { getWidget } from '../../widgets/registry';
import WidgetWrapper from '../../components/WidgetWrapper/WidgetWrapper';
import GlobalFilterBar from '../../components/GlobalFilterBar/GlobalFilterBar';
import WidgetPicker from '../../components/WidgetPicker/WidgetPicker';
import FloatingQueryBar from '../../components/FloatingQueryBar/FloatingQueryBar';
import { DEMO_DASHBOARD } from '../../data/demoData';
import { LayoutDashboard, Plus, RotateCcw } from 'lucide-react';
import styles from './DashboardView.module.css';

const ResponsiveGrid = WidthProvider(Responsive);

/**
 * DashboardView — Main dashboard with a responsive drag-and-drop grid layout.
 * Populated by agent responses or demo data.
 */
export default function DashboardView() {
  const {
    dashboardWidgets,
    dashboardLayout,
    setDashboard,
    removeDashboardWidget,
    updateLayout,
  } = useStore();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  /* Load demo dashboard on first mount if empty */
  useEffect(() => {
    if (dashboardWidgets.length === 0) {
      setDashboard(DEMO_DASHBOARD.widgets, DEMO_DASHBOARD.layout);
    }
  }, []);

  const resetDashboard = () => {
    setDashboard(DEMO_DASHBOARD.widgets, DEMO_DASHBOARD.layout);
  };

  const handleLayoutChange = (layout) => {
    updateLayout(layout);
  };

  if (dashboardWidgets.length === 0) {
    return (
      <div className={styles.dashboardView}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <LayoutDashboard size={36} />
          </div>
          <div className={styles.emptyTitle}>No widgets yet</div>
          <div className={styles.emptyText}>
            Send a query to an agent or load the demo dashboard to get started.
          </div>
          <button className={`${styles.actionBtn} ${styles.primary}`} onClick={() => setIsPickerOpen(true)}>
            <Plus size={16} />
            Add Widget
          </button>
          <button className={styles.actionBtn} onClick={resetDashboard} style={{ marginTop: 8 }}>
            <RotateCcw size={14} />
            Load Demo Dashboard
          </button>
        </div>
        <WidgetPicker isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} />
      </div>
    );
  }

  return (
    <div className={styles.dashboardView}>
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.dashboardTitle}>Analytics Dashboard</h1>
          <p className={styles.dashboardSubtitle}>
            {dashboardWidgets.length} widget{dashboardWidgets.length !== 1 ? 's' : ''} • Drag to rearrange
          </p>
        </div>
        <div className={styles.dashboardActions}>
          <button className={`${styles.actionBtn} ${styles.primary}`} onClick={() => setIsPickerOpen(true)}>
            <Plus size={14} />
            Add Widget
          </button>
          <button className={styles.actionBtn} onClick={resetDashboard}>
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      <GlobalFilterBar />

      <ResponsiveGrid
        className={styles.dashboardGrid}
        layouts={{ lg: dashboardLayout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 12, sm: 6, xs: 4 }}
        rowHeight={60}
        isDraggable
        isResizable
        draggableHandle=".drag-handle"
        onLayoutChange={handleLayoutChange}
        compactType="vertical"
        margin={[16, 16]}
      >
        {dashboardWidgets.map((widget) => {
          const def = getWidget(widget.viz_type);
          if (!def) return null;

          const WidgetComponent = def.component;

          return (
            <div key={widget.id}>
              <WidgetWrapper
                title={widget.viz_config?.title || def.label}
                subtitle={widget.agent_id}
                draggable
                onRemove={() => removeDashboardWidget(widget.id)}
                data={widget.data}
              >
                <Suspense fallback={<div>Loading…</div>}>
                  <WidgetComponent
                    vizConfig={widget.viz_config || {}}
                    data={widget.data}
                    id={widget.id}
                  />
                </Suspense>
              </WidgetWrapper>
            </div>
          );
        })}
      </ResponsiveGrid>

      <FloatingQueryBar />
      <WidgetPicker isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} />
    </div>
  );
}
