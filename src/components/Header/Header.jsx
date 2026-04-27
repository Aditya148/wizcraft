import { useState } from 'react';
import { useStore } from '../../store/useStore';
import DataUploader from '../DataUploader/DataUploader';
import { Menu, Sun, Moon, Zap, Share2 } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const { theme, toggleTheme, toggleSidebar, connected, shareDashboard } = useStore();
  const [justShared, setJustShared] = useState(false);

  const handleShare = () => {
    const url = shareDashboard();
    if (url) {
      navigator.clipboard.writeText(url);
      setJustShared(true);
      setTimeout(() => setJustShared(false), 2000);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button
          className={styles.menuBtn}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          id="sidebar-toggle"
        >
          <Menu size={18} />
        </button>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Zap size={16} />
          </div>
          AgentViz
        </div>
      </div>

      <div className={styles.headerRight}>
        <button 
          className={styles.themeBtn}
          onClick={handleShare}
          style={{ width: 'auto', padding: '0 12px', fontSize: '13px', display: 'flex', gap: '6px' }}
        >
          <Share2 size={14} />
          {justShared ? 'Copied Link!' : 'Share Dash'}
        </button>
        <DataUploader />
        <div
          className={`${styles.connectionBadge} ${
            connected ? styles.connected : styles.disconnected
          }`}
          id="connection-status"
        >
          <span className={styles.connectionDot} />
          {connected ? 'Connected' : 'Disconnected'}
        </div>
        <button
          className={styles.themeBtn}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          id="theme-toggle"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
