import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { booksData } from "@/data/booksData";
import { Book } from "@/types/book";
import { ArrowLeft, BookOpen, Globe, FileText, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CheckoutModal from "@/components/CheckoutModal";

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const book: Book | undefined = booksData.find((b) => b.id === id);

  const [showCheckout, setShowCheckout] = useState(false);
  const [purchaseType, setPurchaseType] = useState<"buy" | "rent">("buy");

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Book not found</h1>
          <button
            onClick={() => navigate("/")}
            className="text-primary underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleBuy = () => {
    setPurchaseType("buy");
    setShowCheckout(true);
  };

  const handleRent = () => {
    setPurchaseType("rent");
    setShowCheckout(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-2xl font-bold text-primary">MyBookSpecial</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left: big cover */}
          <div className="flex justify-center">
  <div className="rounded-xl overflow-hidden shadow-lg bg-white"
       style={{ width: "60%", height: "35rem" }}>
    <img
      src={book.coverImage}
      alt={book.title}
      className="w-full h-full object-cover"
    />
  </div>
</div>


          {/* Right: details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-2">
                {book.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                by <span className="font-semibold">{book.author}</span>
              </p>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Globe className="w-5 h-5" /> {book.language}
              </p>
              <p className="flex items-center gap-2">
                <Building2 className="w-5 h-5" /> {book.publication}
              </p>
              <p className="flex items-center gap-2">
                <FileText className="w-5 h-5" /> {book.pages} pages
              </p>
            </div>

            {/* Price + Buttons */}
            <div className="space-y-4">
              <p className="text-3xl text-primary font-bold">
                ₹{book.price}
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleBuy}
                  className="px-6 bg-primary hover:bg-primary/90"
                >
                  Buy Now
                </Button>
                <Button
                  onClick={handleRent}
                  variant="outline"
                  className="px-6 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                >
                  Rent
                </Button>
              </div>
            </div>

            <div className="bg-secondary/40 border border-secondary/60 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                About this book
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This book is part of our curated MyBookSpecial collection. You can
                explore this title through our buy or rent options and enjoy a
                comfortable reading experience with flexible return options.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          book={book}
          purchaseType={purchaseType}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
};

export default BookDetailsPage;
