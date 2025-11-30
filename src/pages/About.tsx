import { BookOpen, Heart, TrendingUp, Shield } from "lucide-react";

export function About() {
  return (
    <div className="max-w-4xl mx-auto pt-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">About MyBookSpecial</h1>
        <p className="text-lg text-muted-foreground">
          Your trusted companion for discovering and enjoying great books
        </p>
      </div>

      <div className="prose prose-lg max-w-none space-y-8">
        <div className="rounded-lg border border-border bg-card p-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold text-foreground m-0">Our Mission</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            MyBookSpecial is dedicated to making quality literature accessible to everyone. We believe that books have the power to transform lives, and we're committed to connecting readers with stories that inspire, educate, and entertain across multiple languages and cultures.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <Heart className="h-8 w-8 text-primary mb-3" />
            <h3 className="text-xl font-bold text-foreground mb-3">Why Choose Us</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Diverse collection across multiple languages</li>
              <li>• Flexible rental options with fair refund policies</li>
              <li>• Curated picks from literary experts</li>
              <li>• Support for regional literature and authors</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <TrendingUp className="h-8 w-8 text-secondary mb-3" />
            <h3 className="text-xl font-bold text-foreground mb-3">Our Features</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Smart search across books and authors</li>
              <li>• Personalized wishlist management</li>
              <li>• Easy order tracking</li>
              <li>• Secure payment options</li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-accent" />
            <h2 className="text-2xl font-bold text-foreground m-0">Our Commitment</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We're committed to providing a seamless book buying and renting experience. Our rental system is designed to be fair and transparent, allowing you to enjoy books affordably while supporting authors and publishers.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Whether you're a casual reader or a book enthusiast, MyBookSpecial is here to fuel your reading journey with quality books, exceptional service, and a community that celebrates the love of reading.
          </p>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-3">Join Our Reading Community</h3>
          <p className="text-muted-foreground mb-4">
            Start your literary journey today with MyBookSpecial
          </p>
          <p className="text-sm text-muted-foreground">
            Have questions? Contact us at support@mybookspecial.com
          </p>
        </div>
      </div>
    </div>
  );
}
