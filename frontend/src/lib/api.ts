import { AnalyzePayload, AnalyzeResponse } from "@/types";

export async function analyzeTransaction(payload: AnalyzePayload): Promise<AnalyzeResponse> {
  // Simulate network delay to test loading state
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const { transaction_id } = payload;

  if (transaction_id === "TRX-2026-00123") {
    // Scenario 3 - Frozen
    return {
      transaction_id: "TRX-2026-00123",
      status: "frozen",
      risk_score: 80,
      action_taken: "Circuit Breaker Activated",
      forensic_report: [
        {
          agent: "The Analyst",
          detail: "Printer Laser Warna: pengajuan Rp8.000.000 vs pasar Rp3.500.000 (markup 128,57%). Laptop Core i7 16GB: pengajuan Rp25.000.000 vs pasar Rp18.000.000 (markup 38,89%)."
        },
        {
          agent: "The Accountant",
          detail: "Perusahaan berumur 37 hari (didirikan 2026-08-15), tergolong relatif baru."
        }
      ]
    };
  } else if (transaction_id === "TRX-2026-00002") {
    // Scenario 2 - Approved with some risk
    return {
      transaction_id: "TRX-2026-00002",
      status: "approved",
      risk_score: 50,
      action_taken: "Transaction Cleared",
      forensic_report: [
        {
          agent: "The Analyst",
          detail: "Printer Laser Warna: pengajuan Rp8.000.000 vs pasar Rp3.500.000 (markup 128,57%). Laptop Core i7 16GB: pengajuan Rp25.000.000 vs pasar Rp18.000.000 (markup 38,89%)."
        }
      ]
    };
  }

  // Fallback / Scenario 1 - Approved, no risk
  return {
    transaction_id: payload.transaction_id || "TRX-2026-00001",
    status: "approved",
    risk_score: 0,
    action_taken: "Transaction Cleared",
    forensic_report: []
  };
}
