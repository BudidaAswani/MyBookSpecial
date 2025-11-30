// src/pages/Index.tsx
import React, { useState, useEffect, FormEvent, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import QuotesCategories from "@/components/QuotesCategories";
import BooksGrid from "@/components/BooksGrid";
import CheckoutModal from "@/components/CheckoutModal";
import ProfileSection from "@/components/ProfileSection";
import MyOrdersSection from "@/components/MyOrdersSection";
import Footer from "@/components/Footer";
import { Book } from "@/types/book";
import { booksData } from "@/data/booksData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { About } from "./About";
import BookDetailsModal from "@/components/BookDetailsModal";
import { getStoredUser, clearStoredUser } from "@/utils/auth";

// Active Sections
type ActiveSection = "home" | "about" | "orders" | "profile" | "login" | "signup";

// User Model
interface AuthUser {
  name: string;
  email: string;
  password?: string;
}

// Shuffle Helper
const shuffleArray = (array: Book[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const Index = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(shuffleArray(booksData));
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [purchaseType, setPurchaseType] = useState<"buy" | "rent">("buy");
  const [showCheckout, setShowCheckout] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
const [checked, setChecked] = useState(false);

useEffect(() => {
  const u = getStoredUser();
  setCurrentUser(u);
  setChecked(true);
}, []);

  // re-render MyOrdersSection by changing this key after creating an order
  const [ordersVersion, setOrdersVersion] = useState(0);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const [showStickySearch, setShowStickySearch] = useState(false);

  // Auth User (session-based)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // restore auth user from localStorage on mount (keeps session-like behavior)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("authUser");
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.email) setAuthUser({ name: u.name, email: u.email, password: u.password });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Forms
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Search books
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBooks(booksData);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredBooks(
        booksData.filter(
          (book) =>
            book.title.toLowerCase().includes(q) ||
            book.author.toLowerCase().includes(q) ||
            book.language.toLowerCase().includes(q) ||
            book.publication.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery]);

  // Shuffle on home
  useEffect(() => {
    if (activeSection === "home") {
      setFilteredBooks(shuffleArray(booksData));
    }
  }, [activeSection]);

  // Buy / Rent
  const handleBookAction = (book: Book, type: "buy" | "rent") => {
    if (!authUser || !authUser.email) {
      toast.error("Please login to buy or rent books.");
      setActiveSection("login");
      return;
    }
    setSelectedBook(book);
    setPurchaseType(type);

    // prepare pendingRental in sessionStorage for CheckoutModal to read if needed
    if (type === "rent") {
      const pending = {
        bookId: book.id,
        bookTitle: book.title,
        rentalTotal: Number((book as any).price ?? (book as any).originalPrice ?? 0),
        refundableAmount:
          Math.round((Number((book as any).price ?? (book as any).originalPrice ?? 0) * 0.5) * 100) / 100,
      };
      try {
        sessionStorage.setItem("pendingRental", JSON.stringify(pending));
      } catch {}
    } else {
      try {
        sessionStorage.removeItem("pendingRental");
      } catch {}
    }

    setShowCheckout(true);
  };

  // OPEN MODAL: Book Details Blur Popup
  const handleOpenDetails = (book: Book) => {
    setSelectedBook(book);
    setDetailsOpen(true);
  };

  // Logout
  const handleLogout = () => {
    setAuthUser(null);
    toast.success("Logged out");
    setActiveSection("login");
  };

  // Login Submit
  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!loginForm.email || !loginForm.password) {
      toast.error("Please enter email and password.");
      return;
    }

    const saved = localStorage.getItem("authUser");
    if (!saved) {
      toast.error("No account found. Please sign up first.");
      setActiveSection("signup");
      return;
    }

    try {
      const user = JSON.parse(saved);

      if (user.email === loginForm.email && user.password === loginForm.password) {
        setAuthUser({ name: user.name, email: user.email });
        toast.success("Login successful!");
        setActiveSection("home");
      } else {
        toast.error("Invalid email or password.");
      }
    } catch {
      toast.error("Something went wrong while reading your account.");
    }
  };

  // Read pending rental (returns parsed object or null)
  const readPendingRental = () => {
    try {
      const raw = sessionStorage.getItem("pendingRental");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  // Signup Submit
  const handleSignupSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (
      !signupForm.name ||
      !signupForm.email ||
      !signupForm.password ||
      !signupForm.confirmPassword
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const newUser: AuthUser = {
      name: signupForm.name,
      email: signupForm.email,
      password: signupForm.password,
    };

    localStorage.setItem("authUser", JSON.stringify(newUser));

    setAuthUser({ name: newUser.name, email: newUser.email });
    toast.success("Account created and logged in!");
    setActiveSection("home");
  };

  // Sticky Search logic
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const navbarHeight = 72;

      const heroOutOfView = rect.bottom <= navbarHeight;
      setShowStickySearch(heroOutOfView);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ------------------ HANDLE CONFIRM ORDER (saves to localStorage) ------------------
  const handleConfirmOrder = async (orderInfo: {
    method: string;
    paid: number;
    purchaseType: "buy" | "rent";
    rentalDays?: number | null;
    rentalDeadline?: string | null;
    refundableAmount?: number | null;
    address: { fullName: string; phone: string; house: string; street: string; city: string; state: string; pincode: string; };
  }) => {
    try {
      const ordersRaw = localStorage.getItem("orders") || "[]";
      const orders: any[] = JSON.parse(ordersRaw);

      const newOrder = {
        id: `ORD-${Date.now()}`,
        userEmail: authUser?.email ?? null,
        userName: authUser?.name ?? null,
        bookId: selectedBook?.id ?? null,
        bookTitle: selectedBook?.title ?? "",
        //bookCover:selectedBook?.coverImage||selectedBook?.cover||"/covers/default-book.png",
        purchaseType: orderInfo.purchaseType,
        amountPaid: Number(orderInfo.paid ?? 0),
        rentalDays: orderInfo.rentalDays ?? null,
        rentalDeadline: orderInfo.rentalDeadline ?? null,
        refundableAmount: orderInfo.refundableAmount ?? null,
        address: orderInfo.address,
        orderDate: new Date().toISOString(),
        status: orderInfo.purchaseType === "buy" ? "delivered" : "placed",
      };

      orders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(orders));
      console.log("Saved order->",newOrder);

      // UI updates
      toast.success("Order placed successfully!");
      //setShowCheckout(false);
      setOrdersVersion((v) => v + 1); // force MyOrders refresh
      //setActiveSection("orders");
    } catch (err) {
      console.error("Failed to save order:", err);
      toast.error("Failed to place order. Try again.");
    }
  };

  // ---------------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isLoggedIn={!!authUser}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showStickySearch={showStickySearch}
      />

      {/* HOME */}
      {activeSection === "home" && (
        <section className="min-h-[calc(100vh-5rem)] bg-yellow-50">
          <div ref={heroRef}>
            <HeroSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>

          <QuotesCategories onFilter={(books) => setFilteredBooks(books)} />

          <BooksGrid books={filteredBooks} onBookAction={handleBookAction} onOpenDetails={handleOpenDetails} />
        </section>
      )}

      {/* ABOUT */}
      {activeSection === "about" && (
        <div className="bg-yellow-50">
          <About />
          <Footer />
        </div>
      )}

      {/* MY ORDERS */}
      {activeSection === "orders" && (
        <div className="min-h-[calc(100vh-5rem)] bg-yellow-50">
          <MyOrdersSection
            key={ordersVersion}
            isLoggedIn={!!authUser}
            currentUserEmail={authUser?.email}
            ordersVersion={ordersVersion}
          />
        </div>
      )}

      {/* PROFILE */}
      {activeSection === "profile" && (
        <div className="min-h-[calc(100vh-5rem)] bg-yellow-50">
          <ProfileSection isLoggedIn={!!authUser} currentUserEmail={authUser?.email} currentUserName={authUser?.name} />
        </div>
      )}

      {/* LOGIN */}
      {activeSection === "login" && (
        <section className="container mx-auto px-4 py-12 min-h-[60vh]">
          <div className="max-w-md mx-auto bg-yellow-50">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                    />
                  </div>

                  <Button type="submit" className="w-full mt-2">
                    Login
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-4 text-center text-sm">
              <p>
                Don&apos;t have an account?{" "}
                <button type="button" onClick={() => setActiveSection("signup")} className="text-accent underline">
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SIGNUP */}
      {activeSection === "signup" && (
        <section className="container mx-auto px-4 py-12 min-h-[60vh]">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Create a password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Re-enter your password"
                    />
                  </div>

                  <Button type="submit" className="w-full mt-2">
                    Sign Up
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-4 text-center text-sm">
              <p>
                Already have an account?{" "}
                <button type="button" onClick={() => setActiveSection("login")} className="text-accent underline">
                  Login here
                </button>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CHECKOUT MODAL */}
      {showCheckout && selectedBook && (
        <CheckoutModal
          book={selectedBook}
          purchaseType={purchaseType}
          pendingRental={purchaseType === "rent" ? readPendingRental() : null}
          currentUserEmail={authUser?.email}
          onClose={() => setShowCheckout(false)}
          onConfirm={handleConfirmOrder}
        />
      )}

      {/* ⭐ BOOK DETAILS MODAL — BLUR PAGE POPUP ⭐ */}
      <BookDetailsModal
        book={selectedBook}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onAction={(book, type) => {
          handleBookAction(book, type);
          setDetailsOpen(false);
        }}
      />
    </div>
  );
};

export default Index;
