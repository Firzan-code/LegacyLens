export type Vendor = {
  vendor_name: string;
  establishment_date: string | null;
  npwp?: string;
};

export type RabItem = {
  item_name: string;
  quantity: number;
  submitted_unit_price: number;
};

export type MarketReference = {
  item_name: string;
  market_unit_price: number;
};

export type AnalyzePayload = {
  transaction_id: string;
  vendor: Vendor;
  items: RabItem[];
  market_reference: MarketReference[];
};

export type ForensicReportItem = {
  agent: string;
  detail: string;
};

export type AnalyzeResponse = {
  transaction_id: string;
  status: "approved" | "frozen";
  risk_score: number;
  action_taken: string;
  forensic_report: ForensicReportItem[];
};

export type ResultState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "approved"; data: AnalyzeResponse }
  | { status: "frozen"; data: AnalyzeResponse }
  | { status: "error"; kind: "validation" | "server" | "network"; message: string };
