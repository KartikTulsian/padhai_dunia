import React from 'react';

type Column = {
  header: string;
  accessor: string;
  className?: string;
};

type TableProps<T> = {
  columns: Column[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
};

export default function Table<T extends { id: string }>({
  columns,
  data,
  renderRow,
}: TableProps<T>) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-gray-500 text-sm bg-gray-50 border-b-2 border-gray-200">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className={`p-4 font-semibold ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => renderRow(item))}
        </tbody>
      </table>
    </div>
  );
}