import { useState, useMemo } from 'react';
import { useCrossFilter } from '../../hooks/useCrossFilter';
import styles from './TableWidget.module.css';

const PAGE_SIZE = 15;

/**
 * TableWidget — Interactive data table with sorting, filtering, pagination.
 */
export default function TableWidget({ vizConfig = {}, data, id }) {
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);

  const { filteredData } = useCrossFilter(id, data);

  if (!filteredData || !filteredData.length) {
    return <div className={styles.tableContainer}>No data available</div>;
  }

  const columns = vizConfig.columns || Object.keys(filteredData[0] || {});

  const searched = useMemo(() => {
    if (!search.trim()) return filteredData;
    const q = search.toLowerCase();
    return filteredData.filter((row) =>
      columns.some((col) => String(row[col] ?? '').toLowerCase().includes(q))
    );
  }, [filteredData, search, columns]);

  const sorted = useMemo(() => {
    if (!sortCol) return searched;
    return [...searched].sort((a, b) => {
      const av = a[sortCol];
      const bv = b[sortCol];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [searched, sortCol, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
    setPage(0);
  };

  const isNumeric = (col) => typeof data[0]?.[col] === 'number';

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableControls}>
        <input
          className={styles.searchInput}
          placeholder="Search rows…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          id="table-search"
        />
        <span className={styles.rowCount}>
          {sorted.length} row{sorted.length !== 1 ? 's' : ''}
        </span>
      </div>

      <table className={styles.dataTable}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} onClick={() => handleSort(col)}>
                {col}
                {sortCol === col && (
                  <span className={styles.sortIcon}>
                    {sortDir === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paged.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col} className={isNumeric(col) ? styles.numeric : ''}>
                  {row[col] != null ? String(row[col]) : '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
          >
            Prev
          </button>
          <span className={styles.pageInfo}>
            {page + 1} / {totalPages}
          </span>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
