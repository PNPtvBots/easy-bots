import { products } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { Bot } from 'lucide-react';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-4 mb-4">
          <Bot className="h-12 w-12 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
            EasyBots Store
          </h1>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Welcome to the official store for EasyBots. Supercharge your business with our cutting-edge AI chatbot solutions and automation tools.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <footer className="text-center mt-16 text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} EasyBots Inc. All rights reserved.</p>
        <p className="mt-1">
          Payments powered by{' '}
          <a
            href="https://bold.co"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
            Bold.co
          </a>
        </p>
      </footer>
    </main>
  );
}
