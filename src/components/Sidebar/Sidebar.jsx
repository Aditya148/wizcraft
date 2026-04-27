import { useStore } from '../../store/useStore';
import {
  LayoutDashboard,
  BarChart3,
  Activity,
  Terminal,
  Settings,
  Sparkles,
} from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'explorer', label: 'Viz Explorer', icon: BarChart3 },
  { id: 'live', label: 'Live Feed', icon: Activity },
  { id: 'playground', label: 'Playground', icon: Sparkles },
];

const BOTTOM_ITEMS = [
  { id: 'console', label: 'Console', icon: Terminal },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { sidebarOpen, activeView, setActiveView } = useStore();

  return (
    <aside
      className={`${styles.sidebar} ${!sidebarOpen ? styles.collapsed : ''}`}
      id="sidebar"
    >
      <nav className={styles.navSection}>
        <div className={styles.navLabel}>Platform</div>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`${styles.navItem} ${activeView === id ? styles.active : ''}`}
            onClick={() => setActiveView(id)}
            title={label}
            id={`nav-${id}`}
          >
            <span className={styles.navItemIcon}>
              <Icon size={18} />
            </span>
            {label}
          </button>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        {BOTTOM_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`${styles.navItem} ${activeView === id ? styles.active : ''}`}
            onClick={() => setActiveView(id)}
            title={label}
            id={`nav-${id}`}
          >
            <span className={styles.navItemIcon}>
              <Icon size={18} />
            </span>
            {label}
          </button>
        ))}
        <div className={styles.sidebarFooterText}>AgentViz v1.0</div>
      </div>
    </aside>
  );
}
