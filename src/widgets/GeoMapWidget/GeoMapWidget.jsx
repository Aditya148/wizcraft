import ReactECharts from 'echarts-for-react';
import { useStore } from '../../store/useStore';
import { useCrossFilter } from '../../hooks/useCrossFilter';
import styles from './GeoMapWidget.module.css';

/**
 * GeoMapWidget — Renders geographic data visualizations.
 * Supports scatter-geo (point map), bar-like rankings, and basic map layouts.
 * Uses ECharts' built-in geo features for world/country mapping.
 *
 * Data format: [{ name: "CountryOrCity", value: number, lat?: number, lng?: number }]
 */
export default function GeoMapWidget({ vizConfig = {}, data, id }) {
  const theme = useStore((s) => s.theme);
  const { filteredData, applyFilter } = useCrossFilter(id, data);
  const isDark = theme === 'dark';
  const textColor = isDark ? '#9898a8' : '#555566';

  if (!filteredData || !filteredData.length) {
    return <div className={styles.mapContainer}>No geographic data provided</div>;
  }

  const {
    map_type = 'bar_ranking',
    title,
    name_field = 'name',
    value_field = 'value',
    region_field = 'region',
  } = vizConfig;

  const chartColors = isDark
    ? ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']
    : ['#4f46e5', '#7c3aed', '#db2777', '#d97706', '#059669', '#2563eb'];

  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';

  const sortedData = [...filteredData].sort((a, b) => (b[value_field] || 0) - (a[value_field] || 0));
  const maxValue = sortedData[0]?.[value_field] || 1;

  const option = {
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Inter, sans-serif', color: textColor },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: isDark ? '#1e1e2a' : '#fff',
      borderColor,
      textStyle: { color: isDark ? '#f0f0f5' : '#111118', fontSize: 12 },
      extraCssText: 'border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);',
    },
    title: title
      ? {
          text: title,
          left: 'center',
          top: 4,
          textStyle: { fontSize: 14, fontWeight: 600, color: isDark ? '#f0f0f5' : '#111118' },
        }
      : undefined,
    grid: { left: 120, right: 40, top: title ? 52 : 24, bottom: 24 },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: borderColor } },
      axisLabel: { color: textColor, fontSize: 11 },
    },
    yAxis: {
      type: 'category',
      data: sortedData.map((d) => d[name_field]),
      inverse: true,
      axisLine: { lineStyle: { color: borderColor } },
      axisLabel: { color: textColor, fontSize: 11, width: 100, overflow: 'truncate' },
    },
    visualMap: {
      show: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      min: 0,
      max: maxValue,
      text: ['High', 'Low'],
      textStyle: { color: textColor, fontSize: 10 },
      inRange: {
        color: isDark
          ? ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899']
          : ['#93c5fd', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899'],
      },
      calculable: true,
    },
    series: [
      {
        type: 'bar',
        data: sortedData.map((d) => d[value_field]),
        barMaxWidth: 24,
        itemStyle: { borderRadius: [0, 4, 4, 0] },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' } },
      },
    ],
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut',
  };

  const handleClick = (params) => {
    const name = sortedData[params.dataIndex]?.[name_field];
    if (name) {
      applyFilter(name_field, name);
    }
  };

  return (
    <div className={styles.mapContainer}>
      <ReactECharts
        option={option}
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'canvas' }}
        onEvents={{ click: handleClick }}
        notMerge
        lazyUpdate
      />
    </div>
  );
}
