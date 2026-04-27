import { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import {
  BarChart3,
  Table,
  TrendingUp,
  FileText,
  Calculator,
  Map,
  X,
} from 'lucide-react';
import styles from './WidgetPicker.module.css';

const WIDGET_OPTIONS = [
  { type: 'chart', label: 'Chart', category: 'Charts', icon: BarChart3, sample: { viz_type: 'chart', viz_config: { chart_type: 'bar', title: 'New Chart', x_axis: 'category', y_axis: 'value' }, data: [{ category: 'A', value: 30 }, { category: 'B', value: 70 }, { category: 'C', value: 50 }] } },
  { type: 'table', label: 'Data Table', category: 'Data', icon: Table, sample: { viz_type: 'table', viz_config: { title: 'New Table' }, data: [{ name: 'Sample', value: 42, status: 'Active' }] } },
  { type: 'kpi_grid', label: 'KPI Cards', category: 'Metrics', icon: TrendingUp, sample: { viz_type: 'kpi_grid', viz_config: { title: 'KPIs' }, data: [{ label: 'Metric', value: '100', change: '+5%', trend: 'up' }] } },
  { type: 'markdown', label: 'Markdown', category: 'Content', icon: FileText, sample: { viz_type: 'markdown', viz_config: { title: 'Notes' }, data: '## Notes\n\nAdd your content here.' } },
  { type: 'stat_summary', label: 'Statistics', category: 'Analytics', icon: Calculator, sample: { viz_type: 'stat_summary', viz_config: { title: 'Stats' }, data: { columns: [{ name: 'Metric', count: 100, mean: 50, median: 48, std: 12, min: 10, max: 95 }] } } },
  { type: 'geo_map', label: 'Geo Map', category: 'Spatial', icon: Map, sample: { viz_type: 'geo_map', viz_config: { title: 'Geo Data', name_field: 'name', value_field: 'value' }, data: [{ name: 'USA', value: 500 }, { name: 'UK', value: 300 }, { name: 'India', value: 450 }] } },
];

/**
 * WidgetPicker — Modal for adding new widgets to the dashboard.
 */
export default function WidgetPicker({ isOpen, onClose }) {
  const { addDashboardWidget } = useStore();

  /* Close on Escape */
  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose();
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (option) => {
    const widget = {
      id: `w-${Date.now()}`,
      agent_id: 'user-added',
      timestamp: new Date().toISOString(),
      ...option.sample,
    };
    addDashboardWidget(widget);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>Add Widget</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.widgetGrid}>
            {WIDGET_OPTIONS.map((opt) => {
              const IconComp = opt.icon;
              return (
                <button
                  key={opt.type}
                  className={styles.widgetOption}
                  onClick={() => handleSelect(opt)}
                >
                  <div className={styles.widgetOptionIcon}>
                    <IconComp size={20} />
                  </div>
                  <div className={styles.widgetOptionInfo}>
                    <div className={styles.widgetOptionName}>{opt.label}</div>
                    <div className={styles.widgetOptionCategory}>{opt.category}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
