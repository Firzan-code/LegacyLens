import { ResultState, AnalyzeResponse } from "@/types";
import { cn } from "@/lib/utils";

interface TransactionTableProps {
  history: AnalyzeResponse[];
  onSelect: (data: AnalyzeResponse) => void;
}

export function TransactionTable({ history, onSelect }: TransactionTableProps) {
  if (history.length === 0) {
    return (
      <div className="w-full flex flex-col space-y-4">
        <h2 className="text-lg font-bold text-slate-800">RIWAYAT TRANSAKSI</h2>
        <div className="p-8 border border-dashed rounded-xl flex items-center justify-center text-slate-400">
          Belum ada transaksi di sesi ini.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col space-y-4">
      <h2 className="text-lg font-bold text-slate-800">RIWAYAT TRANSAKSI</h2>
      <div className="border rounded-xl overflow-hidden bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b">
            <tr>
              <th className="px-4 py-3">TRX-ID</th>
              <th className="px-4 py-3 text-center">Skor</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {history.map((tx, idx) => (
              <tr 
                key={idx} 
                onClick={() => onSelect(tx)}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-medium text-slate-900">{tx.transaction_id}</td>
                <td className="px-4 py-3 text-center font-semibold">
                  {tx.risk_score}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-bold",
                    tx.status === "frozen" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  )}>
                    {tx.status === "frozen" ? "🔴 FROZEN" : "🟢 APPROVED"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
