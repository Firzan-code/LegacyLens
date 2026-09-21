"use client";

import { useState } from "react";
import { MockModeBadge } from "@/components/mock-mode-badge";
import { TransactionForm } from "@/components/transaction-form";
import { CircuitBreakerPanel } from "@/components/circuit-breaker-panel";
import { ForensicReport } from "@/components/forensic-report";
import { TransactionTable } from "@/components/transaction-table";
import { AnalyzePayload, AnalyzeResponse, ResultState } from "@/types";
import { analyzeTransaction } from "@/lib/api";

export default function Home() {
  const [state, setState] = useState<ResultState>({ status: "idle" });
  const [history, setHistory] = useState<AnalyzeResponse[]>([]);

  const handleSubmit = async (payload: AnalyzePayload) => {
    setState({ status: "loading" });
    try {
      const response = await analyzeTransaction(payload);
      
      // Update state and history
      if (response.status === "frozen" || response.status === "approved") {
        setState({ status: response.status, data: response });
        
        // Add to history if not exists
        setHistory(prev => {
          if (prev.some(t => t.transaction_id === response.transaction_id)) {
            return prev.map(t => t.transaction_id === response.transaction_id ? response : t);
          }
          return [response, ...prev];
        });
      } else {
        setState({ 
          status: "error", 
          kind: "server", 
          message: "Format respons tidak dikenali" 
        });
      }
    } catch (error) {
      setState({ 
        status: "error", 
        kind: "network", 
        message: "Sistem gagal memproses — coba lagi" 
      });
    }
  };

  const handleScenarioChange = () => {
    // Reset state to idle on scenario change
    setState({ status: "idle" });
  };

  const handleSelectHistory = (data: AnalyzeResponse) => {
    setState({ status: data.status, data });
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🛡️</span>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              SDG-16 Sentinel
            </h1>
          </div>
          <MockModeBadge />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Form */}
        <div className="lg:col-span-7 flex flex-col space-y-8">
          <TransactionForm 
            state={state} 
            onSubmit={handleSubmit} 
            onScenarioChange={handleScenarioChange} 
          />
          <TransactionTable 
            history={history} 
            onSelect={handleSelectHistory} 
          />
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-5 flex flex-col space-y-8">
          <CircuitBreakerPanel state={state} />
          <ForensicReport state={state} />
        </div>

      </main>
    </div>
  );
}
