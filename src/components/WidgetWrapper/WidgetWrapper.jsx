import { Suspense, Component, useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, X, GripVertical, MoreVertical, Download, Image as ImageIcon } from 'lucide-react';
import styles from './WidgetWrapper.module.css';

/**
 * Error boundary for individual widgets — prevents one broken widget
 * from crashing the entire dashboard.
 */
class WidgetErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.widgetError}>
          <span>⚠️ Widget Error</span>
          <span>{this.state.error?.message || 'An unexpected error occurred'}</span>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * WidgetWrapper — Standard container for all dashboard widgets.
 * Provides a consistent header, loading/error states, and action buttons.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} [props.icon]
 * @param {React.ReactNode} props.children
 * @param {Function} [props.onRemove]
 * @param {boolean} [props.draggable]
 */
export default function WidgetWrapper({
  title,
  subtitle,
  icon,
  children,
  onRemove,
  draggable = false,
  data = null, // for CSV export
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const exportCSV = () => {
    setMenuOpen(false);
    if (!data || !Array.isArray(data) || !data.length) return;
    
    // Safely get all unique keys
    const headers = Array.from(new Set(data.flatMap(Object.keys)));
    const rows = data.map(obj => 
      headers.map(h => {
        const val = obj[h];
        if (val === null || val === undefined) return '';
        if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
        return val;
      }).join(',')
    );
    
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'export'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPNG = () => {
    setMenuOpen(false);
    const canvas = containerRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'export'}.png`;
      a.click();
    }
  };

  return (
    <div className={styles.widgetWrapper}>
      <div className={styles.widgetHeader}>
        <div className={styles.widgetTitleArea}>
          {draggable && (
            <span className={`${styles.widgetActionBtn} drag-handle`} style={{ cursor: 'grab' }}>
              <GripVertical size={14} />
            </span>
          )}
          {icon && <span className={styles.widgetIcon}>{icon}</span>}
          <span className={styles.widgetTitle}>{title}</span>
          {subtitle && <span className={styles.widgetSubtitle}>{subtitle}</span>}
        </div>
        <div className={styles.widgetActions}>
          <div className={styles.menuContainer} ref={menuRef}>
            <button
              className={styles.widgetActionBtn}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Widget options"
            >
              <MoreVertical size={14} />
            </button>
            {menuOpen && (
              <div className={styles.dropdownMenu}>
                <button className={styles.dropdownItem} onClick={exportCSV} disabled={!data || !data.length}>
                  <Download size={14} /> Export CSV
                </button>
                <button className={styles.dropdownItem} onClick={exportPNG}>
                  <ImageIcon size={14} /> Export PNG
                </button>
              </div>
            )}
          </div>
          {onRemove && (
            <button
              className={styles.widgetActionBtn}
              onClick={onRemove}
              aria-label="Remove widget"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      <div className={styles.widgetBody} ref={containerRef}>
        <WidgetErrorBoundary>
          <Suspense
            fallback={<div className={styles.widgetLoading}>Loading widget…</div>}
          >
            {children}
          </Suspense>
        </WidgetErrorBoundary>
      </div>
    </div>
  );
}
