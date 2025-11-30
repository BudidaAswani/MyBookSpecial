// src/components/BookDetailsModal.tsx
import React, { useEffect, useState } from "react";
import { Book } from "@/types/book";

interface Props {
  book: Book | null;
  open: boolean;
  onClose: () => void;
  onAction?: (book: Book, type: "buy" | "rent") => void;
}

export const BookDetailsPage=()=>{/*...*/};
export default function BookDetailsModal({ book, open, onClose, onAction }: Props) {
  const [mounted, setMounted] = useState(false);

  // derive rental days from page count:
  const deriveDefaultRentalDays = (pages?: number) => {
    if (!pages || pages <= 100) return 4;
    if (pages <= 200) return 6;
    if (pages <= 400) return 8;
    return 10;
  };

  const [rentalDays, setRentalDays] = useState<number>(4);

  useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    setTimeout(() => setMounted(true), 10);
  }, [open]);

  useEffect(() => {
    if (open) setRentalDays(deriveDefaultRentalDays(book?.pages));
  }, [open, book?.id, book?.pages]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const coverSrc =
    (book && ((book as any).coverImage || (book as any).cover || (book as any).image || (book as any).coverUrl)) ||
    "/covers/default-book.png";

  // --- Rules: buy price == rent price at order time
  const unitPrice = Number(book?.price ?? book?.originalPrice ?? 0); // use book.price or fallback
  const rentalAvailable = unitPrice > 0;

  // For this policy: rentalTotal = full book price (not per-day)
  const rentalTotal = rentalAvailable ? unitPrice : 0;

  // Refund policy: 50% of original book price
  const refundablePercent = 0.5;
  const refundableAmount = rentalAvailable ? Math.round(unitPrice * refundablePercent * 100) / 100 : 0;

  // rental deadline
  const rentalDeadline = new Date();
  rentalDeadline.setDate(rentalDeadline.getDate() + rentalDays);
  const rentalDeadlineISO = rentalDeadline.toISOString();

  // on Rent: store pendingRental and call onAction(book, "rent")
  const handleRentClick = () => {
    if (!book) return;
    if (!rentalAvailable) { alert("This book is not available for rent."); return; }

    const pending = {
      bookId: book.id,
      bookTitle: book.title,
      rentalDays,
      rentalTotal,         // full price charged upfront
      refundableAmount,    // 50% of original price
      rentalDeadline: rentalDeadlineISO,
      policyNotes: {
        refundPercent: refundablePercent,
        refundWindow: `${rentalDays} days`,
        refundProcessing: "Refunds processed within 3-5 business days after return",
        lateReturn: "Late returns forfeit refund; ownership transfers to customer",
        condition: "Books must be returned in good condition (no damage, markings, or missing pages)",
      },
      paymentNote: "Full payment required upfront at time of order",
      timestamp: new Date().toISOString(),
    };

    try { sessionStorage.setItem("pendingRental", JSON.stringify(pending)); } catch {}
    onAction?.(book, "rent"); // continue existing checkout flow
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <>
      <style>{`
        @keyframes modalFadeScale {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div className="fixed inset-0 z-[2000] flex items-center justify-center" aria-modal="true" role="dialog" onClick={onClose}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

        <div onClick={(e) => e.stopPropagation()}
             className={`relative z-10 w-[94%] md:w-4/5 lg:w-3/5 max-w-4xl rounded-2xl overflow-hidden border border-yellow-200 shadow-xl p-6 md:p-8 bg-yellow-50/95 text-gray-800`}
             style={{ animation: mounted ? "modalFadeScale 200ms ease-out forwards" : undefined }}>
          <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 bg-gray-200 hover:bg-gray-300 text-gray-700">✕</button>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-44 flex-shrink-0">
              <div className="w-full h-60 md:h-72 rounded-lg overflow-hidden shadow-md bg-white">
                <img src={coverSrc} alt={book?.title} className="w-full h-full object-cover"
                     onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/covers/default-book.png")} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-1">{book?.title ?? "Untitled"}</h2>
              <p className="text-sm text-gray-600 mb-3">by {book?.author ?? "Unknown"}</p>

              <div className="mb-4">
                <div className="flex gap-6 items-center mb-3">
                  <div>
                    <div className="text-xs text-gray-600">Suggested rental period</div>
                    <div className="text-lg font-semibold">{rentalDays} days</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-600">Price (buy or rent)</div>
                    <div className="text-lg font-semibold text-green-700">{rentalAvailable ? `₹${unitPrice}` : "N/A"}</div>
                  </div>

                
                </div>

                <div className="flex gap-6 items-center">
                  <div>
                    <div className="text-xs text-gray-600">Full payment (upfront)</div>
                    <div className="text-lg font-semibold">₹{rentalTotal}</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-600">Refund if returned on time</div>
                    <div className="text-lg font-semibold text-emerald-600">{rentalAvailable ? `₹${refundableAmount} (50%)` : "N/A"}</div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-600 space-y-1">
                  <div>• Return books within deadline to receive 50% refund (processed within 3–5 business days).</div>
                  <div>• Late returns forfeit refund and ownership transfers to customer.</div>
                  <div>• Books must be returned in good condition. Damaged books are not eligible for refunds.</div>
                  <div>• Standard delivery: 3–7 business days. Payment methods: UPI, Netbanking, COD (COD may have extra charges).</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => onAction?.(book as Book, "buy")}
                        className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white font-medium">Buy</button>

                <button onClick={handleRentClick}
                        className={`px-4 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-200 ${!rentalAvailable ? "opacity-50 pointer-events-none" : ""}`}>
                  Rent (pay ₹{rentalTotal})
                </button>

                <button onClick={onClose} className="ml-auto px-3 py-1.5 text-sm rounded-md text-gray-600 hover:text-black">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
