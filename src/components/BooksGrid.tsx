import { Book } from "@/types/book";
import BookCard from "./BookCard";

interface BooksGridProps {
  books: Book[];
  onBookAction: (book: Book, type: "buy" | "rent" | "details") => void;

  // ⭐ NEW: for modal open
  onOpenDetails?: (book: Book) => void;
}

const BooksGrid = ({ books, onBookAction, onOpenDetails }: BooksGridProps) => {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-foreground mb-8">Trending Books</h2>

      {books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">
            No books found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onAction={onBookAction}
              onOpenDetails={onOpenDetails}  // ⭐ NEW: pass to card
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default BooksGrid;
