import { products } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { Bot } from 'lucide-react';
import Link from 'next/link';

const translations = {
  en: {
    title: 'EasyBots Store',
    description: 'Welcome to the official store for EasyBots. Supercharge your business with our cutting-edge AI chatbot solutions and automation tools.',
    footer: 'All rights reserved.',
    payments: 'Payments powered by',
  },
  es: {
    title: 'Tienda EasyBots',
    description: 'Bienvenido a la tienda oficial de EasyBots. Potencia tu negocio con nuestras soluciones de chatbot de IA y herramientas de automatización de vanguardia.',
    footer: 'Todos los derechos reservados.',
    payments: 'Pagos impulsados por',
  },
};

export default function Home({ searchParams }: { searchParams: { lang?: string } }) {
  const lang = searchParams.lang === 'es' ? 'es' : 'en';
  const t = translations[lang];

  return (
    <main className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12">
        <div className="flex justify-end mb-4">
          <Link href={lang === 'en' ? '/?lang=es' : '/'} className="text-sm font-medium text-muted-foreground hover:text-primary">
            {lang === 'en' ? 'Español' : 'English'}
          </Link>
        </div>
        <div className="inline-flex items-center gap-4 mb-4">
          <Bot className="h-12 w-12 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
            {t.title}
          </h1>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {t.description}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} lang={lang} />
        ))}
      </div>

      <footer className="text-center mt-16 text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} EasyBots Inc. {t.footer}</p>
        <p className="mt-1">
          {t.payments}{' '}
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
