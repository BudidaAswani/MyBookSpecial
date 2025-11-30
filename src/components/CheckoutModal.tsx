// src/components/CheckoutModal.tsx
import React, { useEffect, useState } from "react";
import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import OrderSuccess, { OrderSuccessData } from "@/components/OrderSuccess";
import { getRentalDays, calculateRentalDeadline } from "@/utils/rental";


export interface PendingRental {
  bookId: string;
  bookTitle?: string;
  rentalDays?: number;
  rentalTotal?: number;
  refundableAmount?: number;
  rentalDeadline?: string; // ISO
  policyNotes?: any;
  paymentNote?: string;
}

interface Address {
  fullName: string;
  phone: string;
  house: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

interface CheckoutModalProps {
  book: Book;
  purchaseType: "buy" | "rent";
  pendingRental?: PendingRental | null;
  currentUserEmail?: string | null;
  onClose?: () => void;
  onConfirm?: (orderInfo: {
    method: string;
    paid: number;
    purchaseType: "buy" | "rent";

    rentalDays?: number;
    rentalDeadline?: string|null;
    refundableAmount?: number;
    
    address: Address;
  }) => void;
}

export default function CheckoutModal({
  book,
  purchaseType,
  pendingRental = null,
  currentUserEmail = null,
  onClose = () => {},
  onConfirm = () => {},
}: CheckoutModalProps) {
  const [mounted, setMounted] = useState(false);
  const [method, setMethod] = useState<"UPI" | "Netbanking" | "COD">("UPI");
  const [processing, setProcessing] = useState(false);
  const computedRentalDays = getRentalDays(book.pages);
  const computedRentalDeadline = calculateRentalDeadline(book.pages);

  const finalRentalDays=pendingRental?.rentalDays??computedRentalDays;
  const finalRentalDeadline=pendingRental?.rentalDeadline??computedRentalDeadline;



  // Address state
  const [address, setAddress] = useState<Address>({
    fullName: "",
    phone: "",
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const isAddressValid = Boolean(
    address.fullName.trim() &&
      address.phone.trim() &&
      address.house.trim() &&
      address.street.trim() &&
      address.city.trim() &&
      address.state.trim() &&
      address.pincode.trim()
  );

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  if (!book) return null;

  // unitPrice fallback: use book.price then book.originalPrice then 0
  const unitPrice = Number((book as any).price ?? (book as any).originalPrice ?? 0)||0;

  // rentalTotal (if pendingRental provided) else fallback to unitPrice
  const rentalTotal = unitPrice;

  // refundable amount (if pendingRental provided) else 0
  const refundableAmount = Math.round(unitPrice*0.5*100)/100;
  //const refundableAmount=

  // final amount to charge now
  //const amount = purchaseType === "rent" ? unitPrice*0.5 : 0;
  const paid=unitPrice;

  const rentalDeadline = pendingRental?.rentalDeadline ?? null;

  const coverSrc =
    (book as any).coverImage || (book as any).cover || (book as any).image || "/covers/default-book.png";

  // Success state: when set, we show OrderSuccess component in the modal
  const [successData, setSuccessData] = useState<OrderSuccessData | null>(null);

  const handleConfirm = async () => {
    if (!currentUserEmail) {
      alert("Please login to place the order.");
      return;
    }
    if (!isAddressValid) {
      alert("Please fill in all address details.");
      return;
    }

    setProcessing(true);
    try {
      // simulate payment / processing
      await new Promise((r) => setTimeout(r, 700));

      // call parent confirm to let Index.tsx create/save the order
      await Promise.resolve(
        onConfirm({
          method,
          paid,
          purchaseType,
          rentalDays: finalRentalDays,
          rentalDeadline: finalRentalDeadline,
          refundableAmount,
          address,
        })
      );

      // Build success data for the separate OrderSuccess component
      const result: OrderSuccessData = {
        bookTitle: book.title,
        coverSrc,
        type: purchaseType,
        paid,
        refundableAmount,
        rentalDeadline: finalRentalDeadline,
        timestamp: new Date().toISOString(),
        method,
      };

      // keep modal open — show success card
      setSuccessData(result);
    } finally {
      setProcessing(false);
      // DO NOT call onClose() here — we show success inside modal
    }
  };

  // Continue Shopping
  const handleContinue = () => {
    setSuccessData(null);
    onClose();
  };

  // View My Orders
  const handleViewOrders = () => {
    setSuccessData(null);
    onClose();
    try {
      window.location.hash = "#orders";
    } catch {}
  };

  // Simple formatted date helper
  const formatDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";

  return (
    <>
      <style>{`
        @keyframes modalFadeScale {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div
        className="fixed inset-0 z-[2100] flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        onClick={() => {
          // prevent closing when showing success so user doesn't lose the success card accidentally
          if (!successData) onClose();
        }}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

        <div
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 w-[94%] md:w-3/5 max-w-3xl rounded-2xl overflow-hidden border border-yellow-200
                     shadow-xl p-6 md:p-8 bg-yellow-50/95 text-gray-800"
          style={{
            animation: mounted ? "modalFadeScale 180ms ease-out forwards" : undefined,
          }}
        >
          {/* If successData exists, render the OrderSuccess card */}
          {successData ? (
            <OrderSuccess data={successData} onContinue={handleContinue} onViewOrders={handleViewOrders} />
          ) : (
            <>
              {/* Close */}
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 bg-gray-200 hover:bg-gray-300 text-gray-700"
                aria-label="Close checkout"
              >
                ✕
              </button>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Cover */}
                <div className="w-full md:w-36 flex-shrink-0">
                  <div className="w-full h-44 rounded-lg overflow-hidden shadow-md bg-white">
                    <img
                      src={coverSrc}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/covers/default-book.png")}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {book.author}</p>

                  <div className="flex items-center gap-4 text-sm mb-4">
                    <div>
                      <div className="text-xs text-gray-600">Purchase</div>
                      <div className="font-semibold">{purchaseType === "rent" ? "Rental" : "Purchase"}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-600">Amount(Buy/Rent)</div>
                      <div className="font-semibold">₹{unitPrice}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-600">RefundAmount</div>
                      <div className="font-semibold">₹{purchaseType==="rent"? refundableAmount:0}</div>
                    </div>

                  </div>

                  {/* Address form - condensed */}
                  <div className="mb-4">
                    <p className="font-medium mb-2">Delivery Address</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="p-2 rounded-lg border border-gray-300 bg-white"
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      />

                      <input
                        type="text"
                        placeholder="Phone Number"
                        className="p-2 rounded-lg border border-gray-300 bg-white"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      />

                      <input
                        type="text"
                        placeholder="House / Flat No"
                        className="p-2 rounded-lg border border-gray-300 bg-white"
                        value={address.house}
                        onChange={(e) => setAddress({ ...address, house: e.target.value })}
                      />

                      <input
                        type="text"
                        placeholder="Street / Landmark"
                        className="p-2 rounded-lg border border-gray-300 bg-white"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      />

                      <input
                        type="text"
                        placeholder="City"
                        className="p-2 rounded-lg border border-gray-300 bg-white"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      />

                      <input
                        type="text"
                        placeholder="State"
                        className="p-2 rounded-lg border border-gray-300 bg-white"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      />

                      <input
                        type="text"
                        placeholder="Pincode"
                        className="p-2 rounded-lg border border-gray-300 bg-white"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Payment method */}
                  <div className="mb-4">
                    <p className="font-medium mb-2">Payment Method</p>
                    <div className="flex gap-2 flex-wrap mb-2">
                      {(["UPI", "Netbanking", "COD"] as const).map((m) => (
                        <button
                          type="button"
                          key={m}
                          onClick={() => setMethod(m)}
                          className={`px-3 py-1.5 rounded-md text-sm ${
                            method === m ? "bg-green-700 text-white" : "bg-white border border-gray-300 text-gray-800"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">
                      Full payment required upfront. Refund policy: For rentals returned within deadline, 50% refund processed within 3–5 business days.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={handleConfirm}
                      className="bg-green-700 hover:bg-green-800 text-white"
                      disabled={processing || !isAddressValid}
                    >
                      {processing ? "Processing..." : `Confirm & Pay ₹${unitPrice}`}
                    </Button>

                    {/* Use native button for Cancel to ensure onClick fires */}
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-md text-sm border border-gray-300 bg-white hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>

                  <p className="text-xs text-gray-600 mt-4">Delivery: 3–7 business days. COD may have extra charges.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
