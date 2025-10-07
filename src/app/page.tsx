
'use client';
import { products } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { Bot, User as UserIcon, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

const translations = {
  en: {
    title: 'EasyBots Store',
    description: 'Welcome to the official store for EasyBots. Supercharge your business with our cutting-edge AI chatbot solutions and automation tools.',
    footer: 'All rights reserved.',
    payments: 'Payments powered by',
    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy',
    refund: 'Refund Policy',
    login: 'Login',
    logout: 'Logout',
  },
  es: {
    title: 'Tienda EasyBots',
    description: 'Bienvenido a la tienda oficial de EasyBots. Potencia tu negocio con nuestras soluciones de chatbot de IA y herramientas de automatización de vanguardia.',
    footer: 'Todos los derechos reservados.',
    payments: 'Pagos impulsados por',
    terms: 'Términos y Condiciones',
    privacy: 'Política de Privacidad',
    refund: 'Política de Reembolsos',
    login: 'Iniciar Sesión',
    logout: 'Cerrar Sesión',
  },
};

export default function Home() {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') === 'es' ? 'es' : 'en';
  const t = translations[lang];
  const { user, isUserLoading } = useUser();
  const auth = getAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <>
      <header className="mb-12">
        <div className="flex justify-end items-center gap-4 mb-4">
          <Link href={lang === 'en' ? '/?lang=es' : '/'} className="text-sm font-medium text-muted-foreground hover:text-primary">
            {lang === 'en' ? 'Español' : 'English'}
          </Link>
          {!isUserLoading && (
            user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <Button variant="ghost" size="icon" onClick={handleLogout} title={t.logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button asChild variant="outline">
                <Link href={`/login?lang=${lang}`}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  {t.login}
                </Link>
              </Button>
            )
          )}
        </div>
        <div className="text-center">
          <div className="inline-flex items-center gap-4 mb-4">
            <Bot className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
              {t.title}
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.description}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} lang={lang} />
        ))}
      </div>

      <footer className="text-center mt-16 text-muted-foreground text-sm">
        <div className="flex justify-center gap-4 mb-2">
            <Link href={`/terms?lang=${lang}`} className="font-medium text-foreground hover:text-primary transition-colors">{t.terms}</Link>
            <Link href={`/privacy?lang=${lang}`} className="font-medium text-foreground hover:text-primary transition-colors">{t.privacy}</Link>
            <Link href={`/refund?lang=${lang}`} className="font-medium text-foreground hover:text-primary transition-colors">{t.refund}</Link>
        </div>
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
    </>
  );
}
