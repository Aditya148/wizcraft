import ReactECharts from 'echarts-for-react';
import { useStore } from '../../store/useStore';
import styles from './KPIWidget.module.css';

/**
 * KPIWidget — Grid of Key Performance Indicator cards.
 * Each card shows: label, big value, change badge, and optional sparkline.
 */
export default function KPIWidget({ data }) {
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';

  if (!data || !data.length) {
    return <div>No KPI data provided</div>;
  }

  const sparklineOption = (sparkData) => ({
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { type: 'category', show: false, data: sparkData.map((_, i) => i) },
    yAxis: { type: 'value', show: false },
    series: [{
      type: 'line',
      data: sparkData,
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 1.5, color: isDark ? '#6366f1' : '#4f46e5' },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: isDark ? 'rgba(99,102,241,0.3)' : 'rgba(79,70,229,0.2)' }, { offset: 1, color: 'transparent' }] } },
    }],
    animation: true,
    animationDuration: 800,
  });

  return (
    <div className={styles.kpiGrid}>
      {data.map((kpi, idx) => {
        const trend = kpi.trend || (kpi.change?.startsWith('+') ? 'up' : kpi.change?.startsWith('-') ? 'down' : 'neutral');

        return (
          <div className={styles.kpiCard} key={idx}>
            <span className={styles.kpiLabel}>{kpi.label}</span>
            <div className={styles.kpiValueRow}>
              <span className={styles.kpiValue}>{kpi.value}</span>
              {kpi.change && (
                <span className={`${styles.kpiChange} ${styles[trend]}`}>
                  {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {kpi.change}
                </span>
              )}
            </div>
            {kpi.sparkline && (
              <div className={styles.kpiSparkline}>
                <ReactECharts
                  option={sparklineOption(kpi.sparkline)}
                  style={{ width: '100%', height: '100%' }}
                  opts={{ renderer: 'canvas' }}
                  notMerge
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
