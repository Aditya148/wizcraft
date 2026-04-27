import { useState } from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import { useStore } from '../../store/useStore';
import styles from './PivotTableWidget.module.css';

/**
 * PivotTableWidget — Drag-and-drop pivot table for ad-hoc multidimensional analysis.
 */
export default function PivotTableWidget({ vizConfig = {}, data }) {
  const theme = useStore((state) => state.theme);
  const [pivotState, setPivotState] = useState(vizConfig.pivot_state || {});

  if (!data || !data.length) {
    return <div className={styles.container}>No data available for pivot</div>;
  }

  const isDark = theme === 'dark';

  return (
    <div className={`${styles.container} ${isDark ? styles.darkPivot : ''}`}>
      <PivotTableUI
        data={data}
        onChange={s => setPivotState(s)}
        {...pivotState}
      />
    </div>
  );
}
