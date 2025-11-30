import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeroSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const HeroSearch = ({ searchQuery, setSearchQuery }: HeroSearchProps) => {
  return (
    <section className="w-full py-12 bg-[url('/dp2.jpg')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            A book in your hand has more life than a PDF on your Screen.
          </h1>
          <p className="text-lg text-primary-foreground/90 font-bold" >
            Screens tire your eyes, books calm your soul.
          </p>
        </div>
        
        <div className="relative animate-fade-in">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for books, authors, genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-lg bg-card border-none shadow-lg focus-visible:ring-2 focus-visible:ring-accent"
          />
          <img src="https://i.pinimg.com/1200x/43/58/a2/4358a2afc96b06ca646b5f3e140e894a.jpg" alt="logo" className="w-14 h-15 absolute right-4 top-1/2 rounded-full -translate-y-1/2 opacity-80" />
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
