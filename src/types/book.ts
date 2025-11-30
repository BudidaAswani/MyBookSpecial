export interface Book {
  id: string;
  title: string;
  author: string;
  language: string;
  publication: string;
  pages: number;
  price: number;
  coverImage?: string;
}

export interface Order {
  id: string;
  bookId: string;
  bookTitle: string;
  type: "buy" | "rent";
  orderDate: string;
  rentalDeadline?: string;
  pricePaid: number;
  refundableAmount?: number;
  paymentMethod: string;
  status: "active" | "returned" | "owned" | "purchased";

  // 🔐 NEW: which user this order belongs to
  userEmail: string;

  customerInfo: {
    name: string;
    phone: string;
    address: string;
  };
}


export interface Book {
  id: string;
  title: string;
  author: string;
  language: string;
  publication: string;
  pages: number;
  price: number;
  coverImage?: string;
}

export interface Order {
  id: string;
  bookId: string;
  bookTitle: string;
  type: "buy" | "rent";
  orderDate: string;
  rentalDeadline?: string;
  pricePaid: number;
  refundableAmount?: number;
  paymentMethod: string;
  status: "active" | "returned" | "owned" | "purchased";
  customerInfo: {
    name: string;
    phone: string;
    address: string;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  dob?: string;
  avatarUrl?: string;
}
