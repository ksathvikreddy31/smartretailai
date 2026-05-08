export default function DataTable({ columns = [], data = [], onAction }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {columns.map((col) => (
                <th key={col.key} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4 text-slate-700">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && <div className="py-12 text-center text-sm text-slate-400">No data available</div>}
    </div>
  );
}
