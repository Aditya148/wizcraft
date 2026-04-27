import { useEffect, useRef, useCallback } from 'react';
import { eventBus, EVENTS } from '../services/eventBus';
import { useStore } from '../store/useStore';

/**
 * useCrossFilter — Hook that provides cross-filtering capabilities to widgets.
 *
 * @param {string} widgetId - Unique widget identifier
 * @param {Array} data - The widget's raw data array
 * @param {object} [options] - Configuration
 * @param {string} [options.filterField] - Field this widget filters on when clicked
 * @returns {{ filteredData, activeFilters, applyFilter, clearFilter }}
 */
export function useCrossFilter(widgetId, data, options = {}) {
  const { globalFilters, setGlobalFilter, clearGlobalFilters } = useStore();
  const unsubRef = useRef(null);

  /* Subscribe to cross-filter events from other widgets */
  useEffect(() => {
    unsubRef.current = eventBus.on(EVENTS.CROSS_FILTER, (payload) => {
      if (payload.source !== widgetId) {
        setGlobalFilter(payload.field, payload.value);
      }
    });

    return () => unsubRef.current?.();
  }, [widgetId]);

  /* Filter data based on active global filters, excluding own filter */
  const filteredData = (() => {
    if (!data || !Array.isArray(data)) return data;
    if (Object.keys(globalFilters).length === 0) return data;

    return data.filter((row) =>
      Object.entries(globalFilters).every(([field, value]) => {
        if (value == null || value === '') return true;
        if (Array.isArray(value)) {
          return value.length === 0 || value.includes(row[field]);
        }
        return row[field] === value;
      })
    );
  })();

  /* Emit a cross-filter event from this widget */
  const applyFilter = useCallback(
    (field, value) => {
      const currentValue = globalFilters[field];
      const newValue = currentValue === value ? null : value;

      setGlobalFilter(field, newValue);
      eventBus.emit(EVENTS.CROSS_FILTER, {
        field,
        value: newValue,
        source: widgetId,
      });
    },
    [widgetId, globalFilters]
  );

  /* Clear all filters */
  const clearFilter = useCallback(() => {
    clearGlobalFilters();
    eventBus.emit(EVENTS.CROSS_FILTER, {
      field: null,
      value: null,
      source: widgetId,
    });
  }, [widgetId]);

  return {
    filteredData,
    activeFilters: globalFilters,
    applyFilter,
    clearFilter,
  };
}
