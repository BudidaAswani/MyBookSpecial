import { useState, useEffect } from "react";
import { quotes, authors, publications, journals, booksData } from "@/data/booksData";
import { Book } from "@/types/book";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuotesCategoriesProps {
  onFilter: (books: Book[]) => void;
}

const QuotesCategories = ({ onFilter }: QuotesCategoriesProps) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // 👇 3 drop-down values (controlled)
  const [selectedAuthor, setSelectedAuthor] = useState<string | undefined>();
  const [selectedPublication, setSelectedPublication] = useState<string | undefined>();
  const [selectedJournal, setSelectedJournal] = useState<string | undefined>();

  // change quote every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
        setIsAnimating(true);
      }, 200);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // reset all filters & show all books
  const resetAllFilters = () => {
    setSelectedAuthor(undefined);
    setSelectedPublication(undefined);
    setSelectedJournal(undefined);
    onFilter(booksData);
  };

  const handleAuthorChange = (value: string) => {
    setSelectedAuthor(value);
    setSelectedPublication(undefined);
    setSelectedJournal(undefined);

    const filtered = booksData.filter((book) => book.author === value);
    onFilter(filtered);
  };

  const handlePublicationChange = (value: string) => {
    setSelectedPublication(value);
    setSelectedAuthor(undefined);
    setSelectedJournal(undefined);

    const filtered = booksData.filter((book) => book.publication === value);
    onFilter(filtered);
  };

  // here journals are basically languages (Telugu, Hindi, etc.)
  const handleJournalChange = (value: string) => {
    setSelectedJournal(value);
    setSelectedAuthor(undefined);
    setSelectedPublication(undefined);

    const filtered = booksData.filter((book) => book.language === value);
    onFilter(filtered);
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Random Quotes */}
        <div className="w-full py-50 bg-[url('/img2.jpg')] bg-cover shadow-lg bg-center rounded-lg bg-blur bg-no-repeat flex flex-col  justify-center">
          <div
            className={`text-right transition-all duration-300 ${
              isAnimating ? "opacity-100 scale-100 animate-quote-fade" : "opacity-0 scale-95"
            }`}
          >
            <blockquote className="text-xl md:text-2xl font-serif italic text-foreground mb-4">
              "{quotes[currentQuoteIndex].text}"
            </blockquote>
            <p className="text-lg font-medium text-primary">
              — {quotes[currentQuoteIndex].author}
            </p>
          </div>
        </div>

        {/* Right: 3 Drop-down filters */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Browse by Author
            </p>
            <Select value={selectedAuthor} onValueChange={handleAuthorChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an author" />
              </SelectTrigger>
              <SelectContent>
                {authors.map((author) => (
                  <SelectItem key={author} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Browse by Publication
            </p>
            <Select
              value={selectedPublication}
              onValueChange={handlePublicationChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a publication" />
              </SelectTrigger>
              <SelectContent>
                {publications.map((pub) => (
                  <SelectItem key={pub} value={pub}>
                    {pub}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Literary Journals (Language)
            </p>
            <Select value={selectedJournal} onValueChange={handleJournalChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {journals.map((journal) => (
                  <SelectItem key={journal} value={journal}>
                    {journal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Optional: a reset button (if you want) */}
          {/* <button
            type="button"
            className="text-xs text-accent underline mt-2"
            onClick={resetAllFilters}
          >
            Clear filters
          </button> */}
        </div>
      </div>
    </section>
  );
};

export default QuotesCategories;