import styles from './StatSummaryWidget.module.css';

/**
 * StatSummaryWidget — Displays descriptive statistics computed by the agent.
 * Shows metrics like mean, median, std, min, max, quartiles per column.
 */
export default function StatSummaryWidget({ data, vizConfig = {} }) {
  if (!data || (Array.isArray(data) && !data.length)) {
    return <div>No statistical data available</div>;
  }

  /* data format: { columns: [{ name, mean, median, std, min, max, q1, q3, count, skew, kurtosis }] } */
  const columns = data.columns || data;

  const fmt = (v) => {
    if (v == null) return '—';
    if (typeof v === 'number') return Number.isInteger(v) ? v.toLocaleString() : v.toFixed(3);
    return String(v);
  };

  return (
    <div>
      {(Array.isArray(columns) ? columns : [columns]).map((col, idx) => (
        <div className={styles.statSection} key={idx}>
          {col.name && <div className={styles.statSectionTitle}>{col.name}</div>}
          <div className={styles.statGrid}>
            {col.count != null && (
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Count</div>
                <div className={styles.statValue}>{fmt(col.count)}</div>
              </div>
            )}
            {col.mean != null && (
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Mean</div>
                <div className={styles.statValue}>{fmt(col.mean)}</div>
              </div>
            )}
            {col.median != null && (
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Median</div>
                <div className={styles.statValue}>{fmt(col.median)}</div>
              </div>
            )}
            {col.std != null && (
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Std Dev</div>
                <div className={styles.statValue}>{fmt(col.std)}</div>
              </div>
            )}
            {col.min != null && (
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Min</div>
                <div className={styles.statValue}>{fmt(col.min)}</div>
              </div>
            )}
            {col.max != null && (
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Max</div>
                <div className={styles.statValue}>{fmt(col.max)}</div>
              </div>
            )}
            {col.q1 != null && (
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Q1 (25%)</div>
                <div className={styles.statValue}>{fmt(col.q1)}</div>
              </div>
            )}
            {col.q3 != null && (
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Q3 (75%)</div>
                <div className={styles.statValue}>{fmt(col.q3)}</div>
              </div>
            )}
            {col.skew != null && (
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Skewness</div>
                <div className={styles.statValue}>{fmt(col.skew)}</div>
              </div>
            )}
            {col.kurtosis != null && (
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Kurtosis</div>
                <div className={styles.statValue}>{fmt(col.kurtosis)}</div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
