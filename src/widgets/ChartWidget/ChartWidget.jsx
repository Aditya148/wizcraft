import ReactECharts from 'echarts-for-react';
import { useStore } from '../../store/useStore';
import { socketService } from '../../services/socketService';
import 'echarts-gl';
import { eventBus, EVENTS } from '../../services/eventBus';
import { useCrossFilter } from '../../hooks/useCrossFilter';
import styles from './ChartWidget.module.css';

/**
 * Transforms the standardized viz_config + data into an ECharts option object.
 * Supports: bar, line, area, pie, donut, scatter, histogram, heatmap, radar,
 * box, waterfall, funnel, gauge, candlestick, treemap, sunburst, sankey.
 */
function buildOption(vizConfig, data, theme) {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#9898a8' : '#555566';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
  const chartColors = [
    isDark ? '#6366f1' : '#4f46e5',
    isDark ? '#8b5cf6' : '#7c3aed',
    isDark ? '#ec4899' : '#db2777',
    isDark ? '#f59e0b' : '#d97706',
    isDark ? '#10b981' : '#059669',
    isDark ? '#3b82f6' : '#2563eb',
    isDark ? '#f97316' : '#ea580c',
    isDark ? '#14b8a6' : '#0d9488',
    isDark ? '#e879f9' : '#c026d3',
    isDark ? '#facc15' : '#ca8a04',
  ];

  const baseOption = {
    color: chartColors,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Inter, sans-serif', color: textColor },
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#1e1e2a' : '#fff',
      borderColor: borderColor,
      textStyle: { color: isDark ? '#f0f0f5' : '#111118', fontSize: 12 },
      extraCssText: 'border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);',
    },
    grid: { left: 48, right: 24, top: 40, bottom: 36, containLabel: true },
    animation: true,
    animationDuration: 600,
    animationEasing: 'cubicOut',
  };

  const { chart_type, title, x_axis, y_axis, category, value, color } = vizConfig;

  if (title) {
    baseOption.title = {
      text: title,
      left: 'center',
      top: 4,
      textStyle: { fontSize: 14, fontWeight: 600, color: isDark ? '#f0f0f5' : '#111118' },
    };
    baseOption.grid.top = 52;
  }

  switch (chart_type) {
    case 'bar':
    case 'grouped_bar':
    case 'stacked_bar':
    case 'horizontal_bar': {
      const isHorizontal = chart_type === 'horizontal_bar';
      const categories = [...new Set(data.map((d) => d[x_axis]))];
      const groups = color
        ? [...new Set(data.map((d) => d[color]))]
        : [y_axis];

      const series = groups.map((g) => ({
        name: g,
        type: 'bar',
        stack: chart_type === 'stacked_bar' ? 'total' : undefined,
        barMaxWidth: 40,
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' } },
        itemStyle: { borderRadius: isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0] },
        data: categories.map((cat) => {
          const row = data.find((d) => d[x_axis] === cat && (!color || d[color] === g));
          return row ? row[y_axis] : 0;
        }),
      }));

      const catAxis = { type: 'category', data: categories, axisLine: { lineStyle: { color: borderColor } }, axisLabel: { color: textColor, fontSize: 11 } };
      const valAxis = { type: 'value', splitLine: { lineStyle: { color: borderColor } }, axisLabel: { color: textColor, fontSize: 11 } };

      return {
        ...baseOption,
        xAxis: isHorizontal ? valAxis : catAxis,
        yAxis: isHorizontal ? catAxis : valAxis,
        legend: groups.length > 1 ? { data: groups, bottom: 0, textStyle: { color: textColor, fontSize: 11 } } : undefined,
        series,
      };
    }

    case 'line':
    case 'area': {
      const categories = [...new Set(data.map((d) => d[x_axis]))];
      const groups = color ? [...new Set(data.map((d) => d[color]))] : [y_axis];

      const series = groups.map((g) => ({
        name: g,
        type: 'line',
        smooth: true,
        areaStyle: chart_type === 'area' ? { opacity: 0.15 } : undefined,
        symbolSize: 4,
        data: categories.map((cat) => {
          const row = data.find((d) => d[x_axis] === cat && (!color || d[color] === g));
          return row ? row[y_axis] : 0;
        }),
      }));

      return {
        ...baseOption,
        xAxis: { type: 'category', data: categories, axisLine: { lineStyle: { color: borderColor } }, axisLabel: { color: textColor, fontSize: 11 }, boundaryGap: false },
        yAxis: { type: 'value', splitLine: { lineStyle: { color: borderColor } }, axisLabel: { color: textColor, fontSize: 11 } },
        legend: groups.length > 1 ? { data: groups, bottom: 0, textStyle: { color: textColor, fontSize: 11 } } : undefined,
        series,
      };
    }

    case 'pie':
    case 'donut': {
      return {
        ...baseOption,
        tooltip: { ...baseOption.tooltip, trigger: 'item' },
        legend: { orient: 'vertical', right: 16, top: 'center', textStyle: { color: textColor, fontSize: 11 } },
        series: [{
          type: 'pie',
          radius: chart_type === 'donut' ? ['40%', '70%'] : '70%',
          center: ['40%', '50%'],
          itemStyle: { borderRadius: 6, borderColor: isDark ? '#13131d' : '#ffffff', borderWidth: 2 },
          label: { show: false },
          emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
          data: data.map((d) => ({ name: d[category], value: d[value] })),
        }],
      };
    }

    case 'scatter3D': {
      const z_axis = vizConfig.z_axis || Object.keys(data[0]).find(k => k !== x_axis && k !== y_axis && typeof data[0][k] === 'number');
      const sizeField = vizConfig.size;
      const colorField = vizConfig.color;
      return {
        ...baseOption,
        tooltip: {},
        visualMap: colorField ? {
          show: true,
          dimension: 3,
          min: Math.min(...data.map(d => d[colorField])),
          max: Math.max(...data.map(d => d[colorField])),
          inRange: { color: ['#3b82f6', '#8b5cf6', '#ec4899'] },
          textStyle: { color: textColor }
        } : undefined,
        xAxis3D: { type: 'value', name: x_axis },
        yAxis3D: { type: 'value', name: y_axis },
        zAxis3D: { type: 'value', name: z_axis },
        grid3D: {
          viewControl: { projection: 'perspective' },
          boxWidth: 100, boxHeight: 80, boxDepth: 100,
          light: { main: { intensity: 1.2 }, ambient: { intensity: 0.5 } }
        },
        series: [{
          type: 'scatter3D',
          symbolSize: sizeField ? (val) => Math.sqrt(val[4] || 10) * 2 : 8,
          data: data.map((d) => [d[x_axis], d[y_axis], d[z_axis], d[colorField], d[sizeField]]),
          itemStyle: { opacity: 0.8 }
        }],
      };
    }

    case 'scatter':
    case 'bubble': {
      const sizeField = vizConfig.size;
      return {
        ...baseOption,
        xAxis: { type: 'value', name: x_axis, axisLine: { lineStyle: { color: borderColor } }, splitLine: { lineStyle: { color: borderColor } }, axisLabel: { color: textColor } },
        yAxis: { type: 'value', name: y_axis, axisLine: { lineStyle: { color: borderColor } }, splitLine: { lineStyle: { color: borderColor } }, axisLabel: { color: textColor } },
        series: [{
          type: 'scatter',
          symbolSize: sizeField ? (val) => Math.sqrt(val[2]) * 3 : 10,
          data: data.map((d) => sizeField ? [d[x_axis], d[y_axis], d[sizeField]] : [d[x_axis], d[y_axis]]),
          emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } },
        }],
      };
    }

    case 'histogram': {
      const values = data.map((d) => d[x_axis || value || Object.keys(d)[0]]);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const binCount = vizConfig.bins || Math.ceil(Math.sqrt(values.length));
      const binWidth = (max - min) / binCount;
      const bins = Array.from({ length: binCount }, (_, i) => ({
        range: `${(min + i * binWidth).toFixed(1)}`,
        count: values.filter((v) => v >= min + i * binWidth && v < min + (i + 1) * binWidth).length,
      }));

      return {
        ...baseOption,
        xAxis: { type: 'category', data: bins.map((b) => b.range), axisLine: { lineStyle: { color: borderColor } }, axisLabel: { color: textColor, fontSize: 11 } },
        yAxis: { type: 'value', name: 'Frequency', splitLine: { lineStyle: { color: borderColor } }, axisLabel: { color: textColor } },
        series: [{ type: 'bar', data: bins.map((b) => b.count), barWidth: '90%', itemStyle: { borderRadius: [3, 3, 0, 0] } }],
      };
    }

    case 'heatmap': {
      const xCats = [...new Set(data.map((d) => d[x_axis]))];
      const yCats = [...new Set(data.map((d) => d[y_axis]))];
      const heatData = data.map((d) => [xCats.indexOf(d[x_axis]), yCats.indexOf(d[y_axis]), d[value]]);
      const maxVal = Math.max(...heatData.map((d) => d[2]));

      return {
        ...baseOption,
        xAxis: { type: 'category', data: xCats, splitArea: { show: true }, axisLabel: { color: textColor } },
        yAxis: { type: 'category', data: yCats, splitArea: { show: true }, axisLabel: { color: textColor } },
        visualMap: { min: 0, max: maxVal, calculable: true, orient: 'horizontal', left: 'center', bottom: 4, inRange: { color: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899'] }, textStyle: { color: textColor } },
        series: [{ type: 'heatmap', data: heatData, label: { show: true, color: '#fff', fontSize: 11 }, emphasis: { itemStyle: { shadowBlur: 10 } } }],
      };
    }

    case 'radar': {
      const indicators = Object.keys(data[0]).filter((k) => k !== (category || 'name'));
      const maxVals = indicators.map((ind) => Math.max(...data.map((d) => d[ind])) * 1.2);

      return {
        ...baseOption,
        radar: {
          indicator: indicators.map((ind, i) => ({ name: ind, max: maxVals[i] })),
          shape: 'polygon',
          splitLine: { lineStyle: { color: borderColor } },
          splitArea: { areaStyle: { color: 'transparent' } },
          axisLine: { lineStyle: { color: borderColor } },
          axisName: { color: textColor, fontSize: 11 },
        },
        legend: { bottom: 0, textStyle: { color: textColor, fontSize: 11 } },
        series: [{
          type: 'radar',
          data: data.map((d) => ({
            name: d[category || 'name'],
            value: indicators.map((ind) => d[ind]),
            areaStyle: { opacity: 0.15 },
          })),
        }],
      };
    }

    case 'funnel': {
      return {
        ...baseOption,
        tooltip: { ...baseOption.tooltip, trigger: 'item' },
        legend: { bottom: 0, textStyle: { color: textColor } },
        series: [{
          type: 'funnel',
          left: '10%',
          top: 24,
          bottom: 24,
          width: '80%',
          sort: 'descending',
          gap: 2,
          label: { show: true, position: 'inside', fontSize: 12, color: '#fff' },
          itemStyle: { borderColor: isDark ? '#13131d' : '#fff', borderWidth: 1 },
          data: data.map((d) => ({ name: d[category || 'name'], value: d[value] })),
        }],
      };
    }

    case 'gauge': {
      const gaugeValue = data[0]?.[value] || data[0]?.value || 0;
      return {
        ...baseOption,
        series: [{
          type: 'gauge',
          startAngle: 200,
          endAngle: -20,
          min: vizConfig.min || 0,
          max: vizConfig.max || 100,
          progress: { show: true, width: 14 },
          axisLine: { lineStyle: { width: 14, color: [[1, borderColor]] } },
          axisTick: { show: false },
          splitLine: { length: 8, lineStyle: { width: 2, color: textColor } },
          axisLabel: { distance: 20, color: textColor, fontSize: 11 },
          detail: { fontSize: 28, fontWeight: 700, color: isDark ? '#f0f0f5' : '#111118', offsetCenter: [0, '60%'] },
          data: [{ value: gaugeValue, name: vizConfig.label || '' }],
        }],
      };
    }

    case 'treemap': {
      return {
        ...baseOption,
        tooltip: { ...baseOption.tooltip, trigger: 'item' },
        series: [{
          type: 'treemap',
          data: data,
          roam: false,
          breadcrumb: { show: false },
          label: { show: true, fontSize: 12, color: '#fff' },
          itemStyle: { borderColor: isDark ? '#13131d' : '#fff', borderWidth: 2 },
          levels: [{ itemStyle: { borderWidth: 0, gapWidth: 4 } }],
        }],
      };
    }

    case 'sunburst': {
      return {
        ...baseOption,
        tooltip: { ...baseOption.tooltip, trigger: 'item' },
        series: [{
          type: 'sunburst',
          data: data,
          radius: ['10%', '90%'],
          itemStyle: { borderRadius: 4, borderColor: isDark ? '#13131d' : '#fff', borderWidth: 2 },
          label: { show: true, fontSize: 11 },
          emphasis: { focus: 'ancestor' },
        }],
      };
    }

    case 'sankey': {
      return {
        ...baseOption,
        tooltip: { ...baseOption.tooltip, trigger: 'item' },
        series: [{
          type: 'sankey',
          data: vizConfig.nodes || data.nodes || [],
          links: vizConfig.links || data.links || [],
          emphasis: { focus: 'adjacency' },
          lineStyle: { color: 'gradient', curveness: 0.5 },
          label: { color: textColor, fontSize: 11 },
          itemStyle: { borderWidth: 0 },
        }],
      };
    }

    case 'box':
    case 'boxplot': {
      return {
        ...baseOption,
        xAxis: { type: 'category', data: data.map((d) => d.name || d[category]), axisLine: { lineStyle: { color: borderColor } }, axisLabel: { color: textColor } },
        yAxis: { type: 'value', splitLine: { lineStyle: { color: borderColor } }, axisLabel: { color: textColor } },
        series: [{
          type: 'boxplot',
          data: data.map((d) => d.values || [d.min, d.q1, d.median, d.q3, d.max]),
          itemStyle: { borderWidth: 2 },
        }],
      };
    }

    case 'candlestick': {
      return {
        ...baseOption,
        xAxis: { type: 'category', data: data.map((d) => d.date || d[x_axis]), axisLine: { lineStyle: { color: borderColor } }, axisLabel: { color: textColor } },
        yAxis: { type: 'value', splitLine: { lineStyle: { color: borderColor } }, axisLabel: { color: textColor } },
        series: [{
          type: 'candlestick',
          data: data.map((d) => [d.open, d.close, d.low, d.high]),
          itemStyle: { color: '#10b981', color0: '#ef4444', borderColor: '#10b981', borderColor0: '#ef4444' },
        }],
      };
    }

    default: {
      /* Fallback: try to render as a simple bar chart */
      const keys = Object.keys(data[0] || {});
      return {
        ...baseOption,
        xAxis: { type: 'category', data: data.map((d) => d[keys[0]]), axisLabel: { color: textColor } },
        yAxis: { type: 'value', splitLine: { lineStyle: { color: borderColor } }, axisLabel: { color: textColor } },
        series: keys.slice(1).map((k) => ({ name: k, type: 'bar', data: data.map((d) => d[k]) })),
      };
    }
  }
}

/**
 * ChartWidget — Adaptive chart powered by Apache ECharts.
 * Supports 20+ chart types based on viz_config.chart_type.
 */
export default function ChartWidget({ vizConfig, data, id }) {
  const theme = useStore((s) => s.theme);
  const { filteredData, applyFilter } = useCrossFilter(id, data);

  if (!filteredData || (!Array.isArray(filteredData) && typeof filteredData !== 'object')) {
    return <div className={styles.chartContainer}>No data provided</div>;
  }

  const option = buildOption(vizConfig, filteredData, theme);

  const handleClick = (params) => {
    // Basic automatic cross-filter logic if cross_filter isn't explicitly defined
    const field = vizConfig.cross_filter?.field || vizConfig.x_axis || vizConfig.category || vizConfig.name_field;
    if (field && params.name) {
      applyFilter(field, params.name);
    }

    // Always emit a drill-down event so the agent can respond if desired
    if (vizConfig.drill_down !== false) {
      socketService.sendAction({
        type: 'drill_down',
        widget_id: id,
        source: field,
        value: params.name,
        raw_data: params.data,
      });
    }
  };

  return (
    <div className={styles.chartContainer}>
      <ReactECharts
        option={option}
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'canvas' }}
        theme={theme === 'dark' ? 'dark' : undefined}
        onEvents={{ click: handleClick }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
}
