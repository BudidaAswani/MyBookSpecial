// src/components/MyOrdersSection.tsx
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Truck, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { calculateRentalDeadline } from "@/utils/rental";

interface Order {
  id: string;
  userEmail?: string | null;
  userName?: string | null;
  bookId?: string | number | null;
  bookTitle?: string;
  purchaseType?: "buy" | "rent" | string;
  type?: string;
  amountPaid?: number;
  rentalDays?: number | null;
  rentalDeadline?: string | null; // ISO
  refundableAmount?: number | null;
  address?: any;
  paymentMethod?: string | null;
  orderDate?: string;
  status?: string;
  [k: string]: any;
}

interface MyOrdersSectionProps {
  isLoggedIn: boolean;
  currentUserEmail?: string | null;
  ordersVersion?: number;
}

const parseOrdersFromStorage = (): Order[] => {
  try {
    const raw = localStorage.getItem("orders") || "[]";
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Order[];
  } catch (err) {
    console.warn("Failed to parse orders from localStorage:", err);
    return [];
  }
};

const getExpectedDelivery = (iso?: string | null) =>{
  if(!iso) return "";
  const orderDate=new Date(iso);
  const delivery= new Date(orderDate);

  // delivery.setDate(orderDate.getDate()+3);  // add 3days
// Random days -> 3,4,5,6,7 
  const randomDays=Math.floor(Math.random()*5)+3;
  delivery.setDate(orderDate.getDate()+randomDays);
  return delivery.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) ;
}

const canReturn = (order: Order) => {
  
  if (order.purchaseType!=="rent" || order.status === "returned") return false;
  if (!order.rentalDeadline) return false;
  
    const deadline = new Date(order.rentalDeadline);
    const today = new Date();
    return today<= deadline;
  
};

const getTrackingStatus = (order: Order) => {
  const orderDate = order.orderDate ? new Date(order.orderDate) : new Date();
  const today = new Date();
  const diffMs = today.getTime() - orderDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (order.status === "returned") return "Returned";
  if (diffDays <= 0) return "Order placed";
  if (diffDays === 1) return "Packed";
  if (diffDays === 2) return "Shipped";
  if (diffDays === 3) return "Out for delivery";
  return "Delivered";
};

const MyOrdersSection = ({ isLoggedIn, currentUserEmail, ordersVersion }: MyOrdersSectionProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const o = parseOrdersFromStorage();
    setOrders(o);
    setLoading(false);
  }, [currentUserEmail, ordersVersion]);

  // re-read when localStorage changes in another tab
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "orders") {
        setOrders(parseOrdersFromStorage());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!isLoggedIn) {
    return (
      <section className="container mx-auto px-4 py-12 min-h-[60vh]">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Please login to see your orders and track your books.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  // tolerant filter: check multiple fields that may contain the email
  const myOrders = orders.filter((o) => {
    if (!currentUserEmail) return false;
    const possible = [
      o.userEmail,
      o.email,
      o.user?.email,
      o.userEmail?.toString?.(),
      o.userId?.toString?.(),
      o.userName,
    ];
    return possible.some((v) => !!v && v.toString() === currentUserEmail);
  });

  if (!loading && myOrders.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12 min-h-[60vh]">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
            </CardHeader>
            <CardContent>
            <p className="text-sm text-muted-foreground">You don't have any orders yet. Buy or rent a book from the home page.</p>

            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const handleReturnBook = (orderId: string) => {
    const all = parseOrdersFromStorage();
    const updated = all.map((o) => {
      if (o.id === orderId) {
        if (canReturn(o)) {
          toast.success(
            `Book returned. ₹${
              typeof o.refundableAmount === "number" ? o.refundableAmount.toFixed(2) : o.refundableAmount ?? 0
            } refund processed.`
          );
          return { ...o, status: "returned" };
        } else {
          toast.error("Return deadline passed. No refund available.");
          return o;
        }
      }
      return o;
    });
    localStorage.setItem("orders", JSON.stringify(updated));
    setOrders(updated);
  };

  return (
    <section className="container mx-auto px-4 py-12 min-h-[60vh]">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" /> My Orders
            </CardTitle>
          </CardHeader>

          <CardContent>
            {myOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">You don't have any orders yet. Buy or rent a book from the home page.</p>
            ) : (
              <div className="space-y-4">
                {myOrders
                  .slice()
                  .reverse()
                  .map((order) => (
                    <div key={order.id} className="border border-yellow-300 bg-yellow-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
                      <div className="flex flex-col md:flex-row md:justify-between gap-3">
                        {/*Left Side*/}
                      <div className="space-y-1">
                        <p className="font-bold text-lg text-gray-800">{order.bookTitle}</p>
                        
                        <p className="text-xs text-gray-600">
                          Order ID: <span className="font-mono">{order.id}</span>
                        </p>
                        {/*Type Badge*/}
                        <p className="text-xs text-gray-600">
                          Type: {" "} <span className={'inline-block font-semibold px-2 py-1 text-xs rounded-md text-green-500 ${order.type==="buy" ? "bg-green-600 text-white":"bg-blue-600 text-white"}'}>{order.purchaseType==="buy" ? "Purchased" : "Rented"}</span>
                        </p>
                        <p className="text-xs text-gray-600">
                          Order date: {" "} {new Date(order.orderDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric",})}
                        </p>
                        
                      
                      </div>

                      <div className="flex flex-col items-start md:items-end gap-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Truck className="w-4 h-4" />
                          <span>{getTrackingStatus(order)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Expected delivery: {getExpectedDelivery(order.orderDate )}</span>
                        </div>

                        {order.status === "returned" && (
                          <div className="flex items-center gap-1 text-xs text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Returned & refunded</span>
                          </div>
                        )}

                        {(order.type === "rent") && !canReturn(order) && order.status !== "returned" && (
                          <div className="flex items-center gap-1 text-xs text-red-500">
                            <AlertCircle className="w-4 h-4" />
                            <span>Return period over</span>
                          </div>
                        )}

                        {canReturn(order) && (
                          <Button size="sm" variant="outline" onClick={() => handleReturnBook(order.id)}>
                            Return Book & Get Refund
                          </Button>
                        )}
                      </div>
                    </div></div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MyOrdersSection;
