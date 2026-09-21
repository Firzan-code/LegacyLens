import { useState } from "react";
import { AnalyzePayload, ResultState } from "@/types";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface TransactionFormProps {
  state: ResultState;
  onSubmit: (payload: AnalyzePayload) => void;
  onScenarioChange: () => void;
}

const SCENARIOS = {
  normal: {
    transaction_id: "TRX-2026-00001",
    vendor: {
      vendor_name: "CV Abadi Sentosa",
      establishment_date: "2015-06-01",
      npwp: "02.345.678.9-012.000"
    },
    items: [
      { item_name: "Kursi Kantor Ergonomis", quantity: 20, submitted_unit_price: 1200000 },
      { item_name: "ATK Bulanan", quantity: 1, submitted_unit_price: 5000000 }
    ],
    market_reference: [
      { item_name: "Kursi Kantor Ergonomis", market_unit_price: 1150000 },
      { item_name: "ATK Bulanan", market_unit_price: 4800000 }
    ]
  },
  markup: {
    transaction_id: "TRX-2026-00002",
    vendor: {
      vendor_name: "PT Mitra Teknologi Nusantara",
      establishment_date: "2016-02-10",
      npwp: "03.456.789.0-123.000"
    },
    items: [
      { item_name: "Laptop Core i7 16GB", quantity: 10, submitted_unit_price: 25000000 },
      { item_name: "Printer Laser Warna", quantity: 5, submitted_unit_price: 8000000 }
    ],
    market_reference: [
      { item_name: "Laptop Core i7 16GB", market_unit_price: 18000000 },
      { item_name: "Printer Laser Warna", market_unit_price: 3500000 }
    ]
  },
  fictitious: {
    transaction_id: "TRX-2026-00123",
    vendor: {
      vendor_name: "PT Sumber Makmur Jaya",
      establishment_date: "2026-08-15",
      npwp: "01.234.567.8-901.000"
    },
    items: [
      { item_name: "Laptop Core i7 16GB", quantity: 10, submitted_unit_price: 25000000 },
      { item_name: "Printer Laser Warna", quantity: 5, submitted_unit_price: 8000000 }
    ],
    market_reference: [
      { item_name: "Laptop Core i7 16GB", market_unit_price: 18000000 },
      { item_name: "Printer Laser Warna", market_unit_price: 3500000 }
    ]
  }
};

export function TransactionForm({ state, onSubmit, onScenarioChange }: TransactionFormProps) {
  const [payload, setPayload] = useState<AnalyzePayload>(SCENARIOS.normal);
  
  const isLoading = state.status === "loading";

  const handleScenarioSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value as keyof typeof SCENARIOS;
    if (SCENARIOS[key]) {
      setPayload(SCENARIOS[key]);
      onScenarioChange();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onSubmit(payload);
    }
  };

  const getFieldError = (fieldLoc: string) => {
    if (state.status === "error" && state.kind === "validation") {
      // Very basic field matching for PoC
      if (state.message.includes(fieldLoc)) return state.message;
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-6 bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex flex-col space-y-1.5">
        <h2 className="text-xl font-bold text-slate-800">INPUT TRANSAKSI</h2>
        <p className="text-sm text-slate-500">Pilih skenario untuk mengisi form secara otomatis.</p>
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-semibold text-slate-700">Load Skenario</label>
        <select 
          disabled={isLoading}
          onChange={handleScenarioSelect}
          className="p-2 border rounded-md bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="normal">1 - Normal (TRX-2026-00001)</option>
          <option value="markup">2 - Markup Harga (TRX-2026-00002)</option>
          <option value="fictitious">3 - Vendor Fiktif + Markup (TRX-2026-00123)</option>
        </select>
      </div>

      <div className="flex flex-col space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-slate-800">Data Vendor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm text-slate-600">Nama Vendor</label>
            <input 
              readOnly 
              value={payload.vendor.vendor_name}
              className="p-2 border rounded-md bg-slate-100 text-slate-600"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm text-slate-600">Tanggal Berdiri</label>
            <input 
              readOnly 
              value={payload.vendor.establishment_date || ""}
              className="p-2 border rounded-md bg-slate-100 text-slate-600"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Daftar Item RAB</h3>
          <button type="button" disabled className="text-sm text-blue-600 flex items-center font-medium opacity-50 cursor-not-allowed">
            <Plus className="h-4 w-4 mr-1" />
            Tambah Item
          </button>
        </div>
        
        {payload.items.map((item, idx) => (
          <div key={idx} className="flex gap-3 items-end bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="flex-1 flex flex-col space-y-1.5">
              <label className="text-xs text-slate-500">Nama Item</label>
              <input readOnly value={item.item_name} className="p-2 text-sm border rounded-md bg-white text-slate-700" />
            </div>
            <div className="w-20 flex flex-col space-y-1.5">
              <label className="text-xs text-slate-500">Qty</label>
              <input readOnly value={item.quantity} className="p-2 text-sm border rounded-md bg-white text-slate-700" />
            </div>
            <div className="flex-1 flex flex-col space-y-1.5">
              <label className="text-xs text-slate-500">Harga Pengajuan</label>
              <input readOnly value={`Rp ${item.submitted_unit_price.toLocaleString('id-ID')}`} className="p-2 text-sm border rounded-md bg-white text-slate-700" />
            </div>
            <button type="button" disabled className="p-2 text-slate-400 hover:text-red-500 mb-0.5 opacity-50 cursor-not-allowed">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-md transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Menganalisis...
          </>
        ) : (
          "Analisis Transaksi"
        )}
      </button>
    </form>
  );
}
