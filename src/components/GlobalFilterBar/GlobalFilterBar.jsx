import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Filter, X } from 'lucide-react';
import styles from './GlobalFilterBar.module.css';

/**
 * GlobalFilterBar — Top-level filter controls that apply across all dashboard widgets.
 * Auto-detects filterable fields from the dashboard widgets' data.
 *
 * @param {object} props
 * @param {Array} [props.filters] - Explicit filter definitions: [{ field, label, type, options }]
 */
export default function GlobalFilterBar({ filters: explicitFilters }) {
  const { dashboardWidgets, globalFilters, setGlobalFilter, clearGlobalFilters } = useStore();

  /* Auto-detect filterable fields from all widget data */
  const detectedFilters = useMemo(() => {
    if (explicitFilters) return explicitFilters;

    const fieldMap = new Map();

    dashboardWidgets.forEach((widget) => {
      if (!widget.data || !Array.isArray(widget.data)) return;

      const sample = widget.data[0];
      if (!sample) return;

      Object.entries(sample).forEach(([key, value]) => {
        if (typeof value === 'string' && !fieldMap.has(key)) {
          const uniqueValues = [...new Set(widget.data.map((d) => d[key]).filter(Boolean))];
          if (uniqueValues.length > 1 && uniqueValues.length <= 20) {
            fieldMap.set(key, {
              field: key,
              label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              type: 'select',
              options: uniqueValues.sort(),
            });
          }
        }
      });
    });

    return Array.from(fieldMap.values());
  }, [dashboardWidgets, explicitFilters]);

  const activeFilterCount = Object.values(globalFilters).filter(
    (v) => v != null && v !== ''
  ).length;

  if (detectedFilters.length === 0) return null;

  return (
    <div className={styles.filterBar}>
      <span className={styles.filterLabel}>
        <Filter size={14} />
        Filters
      </span>

      {detectedFilters.map((filter) => (
        <div key={filter.field} className={styles.filterGroup}>
          <span className={styles.filterFieldLabel}>{filter.label}:</span>
          {filter.type === 'date-range' ? (
            <>
              <input
                type="date"
                className={styles.dateInput}
                value={globalFilters[`${filter.field}_start`] || ''}
                onChange={(e) => setGlobalFilter(`${filter.field}_start`, e.target.value)}
              />
              <span className={styles.filterFieldLabel}>to</span>
              <input
                type="date"
                className={styles.dateInput}
                value={globalFilters[`${filter.field}_end`] || ''}
                onChange={(e) => setGlobalFilter(`${filter.field}_end`, e.target.value)}
              />
            </>
          ) : (
            <select
              className={styles.filterSelect}
              value={globalFilters[filter.field] || ''}
              onChange={(e) => setGlobalFilter(filter.field, e.target.value || null)}
            >
              <option value="">All</option>
              {filter.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}

      {/* Active filter tags */}
      {Object.entries(globalFilters)
        .filter(([, v]) => v != null && v !== '')
        .map(([field, value]) => (
          <span key={field} className={styles.activeTag}>
            {field}: {value}
            <button
              className={styles.removeTag}
              onClick={() => setGlobalFilter(field, null)}
              aria-label={`Remove ${field} filter`}
            >
              <X size={10} />
            </button>
          </span>
        ))}

      {activeFilterCount > 0 && (
        <button className={styles.clearAllBtn} onClick={clearGlobalFilters}>
          Clear all
        </button>
      )}
    </div>
  );
}
