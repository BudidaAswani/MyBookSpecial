// src/components/Navbar.tsx
import { useState } from "react";
import { Menu, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

type Section = "home" | "about" | "orders" | "profile" | "login" | "signup";

interface NavbarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  isLoggedIn: boolean;
  onLogout: () => void;

  // 👇 for search bar
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  // 👇 e prop decide chestundi: search bar navbar lo kanipinchala leda
  showStickySearch: boolean;
}

const Navbar = ({
  activeSection,
  setActiveSection,
  isLoggedIn,
  onLogout,
  searchQuery,
  setSearchQuery,
  showStickySearch,
}: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainItems: { id: Section; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "orders", label: "My Orders" },
    { id: "profile", label: "Profile" },
  ];

  const handleNavClick = (section: Section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-border shadow-lg bg-gradient-to-r from-[#a8e6a1] to-[#c7e7ff] backdrop-blur">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        {/* 1️⃣ Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleNavClick("home")}
        >
                  <img src="/favicon.ico" className="w-12 h-12  " />

          <div className="leading-tight">
            <p className="font-bold text-lg">MyBookSpecial</p>
          </div>
        </div>

        {/* 2️⃣ Search bar (center, desktop) */}
        {/* 2️⃣ Sticky search bar – ONLY when showStickySearch = true */}
        {showStickySearch && (
        <div className="hidden md:flex flex-1 justify-center">
          <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 pr-12 py-1.5 rounded-full bg-white/10 text-sm  focus:outline-none focus:ring-2 focus:ring-green-500/40"
          />
          <img src="https://i.pinimg.com/736x/58/f7/e6/58f7e6473059d29c214c42c02fcd0a5b.jpg" alt="logo" className="w-6 h-6 absolute right-3 top-1/2 -translate-y-1/2 opacity-80" />
          </div>

        </div>
        )}



        {/* 3️⃣ Menu + auth (right, desktop) */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {mainItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-sm font-medium px-3 py-1 rounded-full transition-colors ${
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {item.label}
            </button>
          ))}

          {!isLoggedIn ? (
            <>
              <Button
                variant={activeSection === "login" ? "default" : "outline"}
                size="sm"
                onClick={() => handleNavClick("login")}
              >
                Login
              </Button>
              <Button
                variant={activeSection === "signup" ? "default" : "outline"}
                size="sm"
                onClick={() => handleNavClick("signup")}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="text-red-500 border-red-300 hover:bg-red-50"
            >
              Logout
            </Button>
          )}
        </div>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-secondary"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">Open main menu</span>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile dropdown (includes search + links) */}
      {/* Mobile dropdown (ikkada search optional ga veyyachu, showStickySearch meeda depend avvachu) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-3 space-y-3">
            {/* Sticky search mobile lo kuda kanipinchali anukunte showStickySearch chusukuntaam */}
            {showStickySearch && (
            <div>
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border rounded-full bg-secondary/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              />
            </div>
            )}

            {mainItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-2 text-base font-medium rounded-md transition-colors ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {item.label}
              </button>
            ))}

            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => handleNavClick("login")}
                  className={`block w-full text-left px-4 py-2 text-base font-medium rounded-md transition-colors ${
                    activeSection === "login"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick("signup")}
                  className={`block w-full text-left px-4 py-2 text-base font-medium rounded-md transition-colors ${
                    activeSection === "signup"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-red-500 hover:bg-secondary rounded-md"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
