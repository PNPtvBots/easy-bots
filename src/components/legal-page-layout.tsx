import Link from 'next/link';
import { Bot, Home } from 'lucide-react';

export const translations = {
    en: {
      goHome: 'Back to Store',
    },
    es: {
      goHome: 'Volver a la Tienda',
    },
};

interface LegalPageLayoutProps {
    title: string;
    children: React.ReactNode;
    homeHref: string;
    t: { goHome: string };
}

export function LegalPageLayout({ title, children, homeHref, t }: LegalPageLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <Link href={homeHref} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
          <Home className="h-4 w-4" />
          {t.goHome}
        </Link>
        <div className="flex items-center gap-4 mt-4">
            <Bot className="h-10 w-10 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">{title}</h1>
        </div>
      </header>
      <article>
        {children}
      </article>
    </div>
  );
}
