import { ReactNode } from "react";

interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyHint?: string;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  rows,
  loading,
  emptyTitle = "Nothing here yet",
  emptyHint = "Records will appear here once added.",
  rowKey,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white" role="region" aria-label="Data table" tabIndex={0}>
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-paper">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-3 font-medium text-muted">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-muted">
                Loading records…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center">
                <p className="font-medium text-ink">{emptyTitle}</p>
                <p className="mt-1 text-sm text-muted">{emptyHint}</p>
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`border-b border-border last:border-0 ${onRowClick ? "cursor-pointer hover:bg-paper" : ""}`}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={onRowClick ? (event) => { if (event.key === "Enter" || event.key === " ") onRowClick(row); } : undefined}
              >
                {columns.map((col) => (
                  <td key={col.header} className={`px-4 py-3 text-ink ${col.className ?? ""}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
