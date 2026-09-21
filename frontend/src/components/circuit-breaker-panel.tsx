import { ResultState } from "@/types";
import { ShieldAlert, ShieldCheck, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface CircuitBreakerPanelProps {
  state: ResultState;
}

export function CircuitBreakerPanel({ state }: CircuitBreakerPanelProps) {
  let bgColor = "bg-slate-50";
  let borderColor = "border-slate-200";
  let textColor = "text-slate-500";
  let Icon = Shield;
  let statusText = "Menunggu Transaksi...";
  let score = 0;
  let isIdle = true;
  let isAnimating = false;

  if (state.status === "loading") {
    statusText = "Menganalisis...";
    isIdle = true;
  } else if (state.status === "approved" || state.status === "frozen") {
    isIdle = false;
    score = state.data.risk_score;
    if (state.status === "frozen") {
      bgColor = "bg-red-50";
      borderColor = "border-red-500";
      textColor = "text-red-700";
      Icon = ShieldAlert;
      statusText = state.data.action_taken || "Circuit Breaker Activated";
      isAnimating = true;
    } else {
      bgColor = "bg-green-50";
      borderColor = "border-green-500";
      textColor = "text-green-700";
      Icon = ShieldCheck;
      statusText = state.data.action_taken || "Transaction Cleared";
    }
  }

  return (
    <div className="w-full flex flex-col space-y-4">
      <h2 className="text-lg font-bold text-slate-800">CIRCUIT BREAKER PANEL</h2>
      
      <div 
        className={cn(
          "w-full rounded-xl border-2 p-6 flex flex-col items-center justify-center space-y-4 transition-all duration-500",
          bgColor, borderColor,
          isAnimating ? "animate-in zoom-in duration-300" : ""
        )}
      >
        <div className={cn("p-4 rounded-full bg-white shadow-sm", textColor)}>
          <Icon className="h-10 w-10" />
        </div>
        
        <h3 className={cn("text-xl font-bold text-center", textColor)}>
          {statusText}
        </h3>

        {!isIdle && (
          <div className="w-full max-w-xs mt-4 flex flex-col items-center space-y-2">
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
              Risk Score
            </span>
            <div className="flex items-baseline space-x-1">
              <span className={cn("text-4xl font-black", textColor)}>{score}</span>
              <span className="text-slate-400 font-medium">/ 100</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mt-2">
              <div 
                className={cn(
                  "h-full transition-all duration-1000 ease-out", 
                  state.status === "frozen" ? "bg-red-500" : "bg-green-500"
                )}
                style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
