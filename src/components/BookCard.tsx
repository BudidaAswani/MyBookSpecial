// src/components/BookCard.tsx

import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { User, Globe, Building2, FileText } from "lucide-react";

interface BookCardProps {
  book: Book;
  onAction: (book: Book, type: "buy" | "rent") => void;

  // ⭐ NEW: used for opening blur modal
  onOpenDetails?: (book: Book) => void;
}

const BookCard = ({ book, onAction, onOpenDetails }: BookCardProps) => {
  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="bg-gradient-to-br from-secondary to-secondary/50 pb-4">

        {/* ⭐ BOOK COVER — Opens Book Details Modal */}
        <div
          className="w-full h-80 rounded-lg mb-4 overflow-hidden shadow-md bg-yellow-50 cursor-pointer"
          onClick={() => onOpenDetails?.(book)}
        >
          <img
            src={book.coverImage || book.cover}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) =>
              ((e.currentTarget as HTMLImageElement).src = "/covers/default-book.png")
            }
          />
        </div>

        {/* BOOK TITLE */}
        <h3 className="text-lg font-bold text-foreground line-clamp-2 min-h-[3.5rem]">
          {book.title}
        </h3>
      </CardHeader>

      <CardContent className="flex-1 pt-4 space-y-2">

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span className="line-clamp-1">{book.author}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="h-4 w-4" />
          <span>{book.language}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span className="line-clamp-1">{book.publication}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>{book.pages} pages</span>
        </div>

        <div className="pt-2">
          <span className="text-2xl font-bold text-primary">
            ₹{book.price || book.originalPrice}
          </span>
        </div>

      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        {/* BUY BUTTON */}
        <Button
          onClick={() => onAction(book, "buy")}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          Buy
        </Button>

        {/* RENT BUTTON */}
        <Button
          onClick={() => onAction(book, "rent")}
          variant="outline"
          className="flex-1 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
        >
          Rent
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
