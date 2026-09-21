import { ResultState } from "@/types";
import { AlertCircle, LineChart, FileWarning } from "lucide-react";
import { cn } from "@/lib/utils";

interface ForensicReportProps {
  state: ResultState;
}

function getAgentIcon(agentName: string) {
  if (agentName.includes("Analyst")) return <FileWarning className="h-5 w-5 text-amber-600" />;
  if (agentName.includes("Accountant")) return <LineChart className="h-5 w-5 text-blue-600" />;
  return <AlertCircle className="h-5 w-5 text-slate-600" />;
}

export function ForensicReport({ state }: ForensicReportProps) {
  if (state.status === "idle" || state.status === "loading") {
    return null;
  }

  if (state.status === "error") {
    if (state.kind === "validation") return null;
    return (
      <div className="w-full p-4 border rounded-xl bg-red-50 border-red-200">
        <h3 className="font-semibold text-red-800 mb-2">Error Detail</h3>
        <p className="text-sm text-red-700">{state.message}</p>
      </div>
    );
  }

  const { data } = state;
  const reports = data.forensic_report || [];

  return (
    <div className="w-full flex flex-col space-y-4">
      <h2 className="text-lg font-bold text-slate-800">LAPORAN FORENSIK</h2>
      
      {reports.length === 0 ? (
        <div className="p-4 border rounded-xl bg-green-50 border-green-200">
          <p className="text-sm font-medium text-green-800 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Tidak ada temuan risiko.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {reports.map((report, idx) => (
            <div key={idx} className="flex p-4 border rounded-xl bg-white shadow-sm gap-4 items-start">
              <div className="flex-shrink-0 mt-0.5">
                {getAgentIcon(report.agent)}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900 mb-1">{report.agent}</h4>
                <p className="text-sm text-slate-600">{report.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
