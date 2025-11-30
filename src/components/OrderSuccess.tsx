// src/components/OrderSuccess.tsx
import React from "react";

export interface OrderSuccessData {
  bookTitle: string;
  coverSrc?: string | null;
  type: "buy" | "rent";
  paid: number;
  refundableAmount?: number;
  rentalDeadline?: string | null; // ISO string
  timestamp?: string; // ISO
  method?: string;
}

interface Props {
  data: OrderSuccessData;
  // Called when user clicks Continue Shopping
  onContinue: () => void;
  // Called when user clicks View My Orders
  onViewOrders: () => void;
  // Optional small prop to control compact mode (smaller card)
  compact?: boolean;
}

export default function OrderSuccess({ data, onContinue, onViewOrders, compact = false }: Props) {
  const formatDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";

  const cover = data.coverSrc || "/covers/default-book.png";

  return (
    <div className={`flex flex-col items-center gap-4 py-6 text-center ${compact ? "px-2" : "px-6"}`}>
      <div
        className="rounded-full bg-emerald-600 w-20 h-20 flex items-center justify-center shadow-lg"
        aria-hidden
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-white">
          <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold">Order Successful!</h2>
      <p className="text-sm text-gray-700">Thanks — your order has been placed.</p>

      <div className={`w-full ${compact ? "max-w-xs" : "max-w-sm"} bg-white/60 rounded-lg p-4 shadow-sm`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-16 overflow-hidden rounded-md bg-white flex-shrink-0">
            <img
              src={cover}
              alt={data.bookTitle}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/covers/default-book.png";
              }}
            />
          </div>

          <div className="flex-1 text-left">
            <div className="text-sm font-semibold">{data.bookTitle}</div>
            <div className="text-xs text-gray-600 font-bold font-large text-green-700">{data.type === "rent" ? "Rented" : "Purchased"}</div>
            <div className="text-sm mt-1 font-medium">Paid : ₹{data.refundableAmount*2}</div>
            
            {data.type === "rent" && typeof data.refundableAmount !== "undefined" && (
              <div className="text-xs font-medium text-gray-600 mt-1">Refundable: ₹{data.refundableAmount}</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        <button
          onClick={onContinue}
          className="px-4 py-2 rounded-md bg-white border border-gray-200 text-gray-800"
        >
          Continue Shopping
        </button>

        <button
          onClick={onViewOrders}
          className="px-4 py-2 rounded-md bg-green-700 text-white"
        >
          View My Orders
        </button>
      </div>

      <p className="text-xs text-gray-600 mt-2">Refunds (if any) processed within 3–5 business days after return.</p>
    </div>
  );
}
