
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/products';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Smartphone, ShoppingCart, User } from 'lucide-react';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
  lang: 'en' | 'es';
}

const formatCurrency = (amount: number, currency: 'USD' | 'COP') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

const translations = {
  en: {
    buy: 'Buy',
    buyOnApp: 'Buy on Android App',
    loginPrompt: 'Please log in to purchase.',
  },
  es: {
    buy: 'Comprar',
    buyOnApp: 'Comprar en la App',
    loginPrompt: 'Por favor, inicia sesión para comprar.',
  },
};

export function ProductCard({ product, lang }: ProductCardProps) {
  const t = translations[lang];
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const getCheckoutUrl = (currency: 'USD' | 'COP') => {
    const baseUrl = 'https://checkout.bold.co/';
    const params = new URLSearchParams({
      item_id: product.id,
      currency: currency,
    });

    if (user) {
      params.append('payment_method[metadata][userId]', user.uid);
      if (user.email) {
        params.append('customer[email]', user.email);
      }
      if (user.displayName) {
        params.append('customer[name]', user.displayName);
      }
    }
    
    return `${baseUrl}?${params.toString()}`;
  };

  const handleBuyClick = (currency: 'USD' | 'COP') => {
    if (!user) {
      toast({
        title: t.loginPrompt,
        variant: 'destructive',
      });
      router.push(`/login?lang=${lang}`);
    } else {
      window.open(getCheckoutUrl(currency), '_blank');
    }
  };


  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="aspect-[3/2] relative w-full">
          <Image
            src={product.image.src}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={product.image.hint}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <div className="p-6">
          <CardTitle className="font-headline text-xl">{lang === 'es' ? product.name_es : product.name}</CardTitle>
          <CardDescription className="mt-2 min-h-[40px]">{lang === 'es' ? product.description_es : product.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <div className="flex justify-around items-center text-center">
          <div>
            <p className="text-sm text-muted-foreground">USD</p>
            <p className="text-2xl font-bold">{formatCurrency(product.prices.usd, 'USD')}</p>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div>
            <p className="text-sm text-muted-foreground">COP</p>
            <p className="text-2xl font-bold">{formatCurrency(product.prices.cop, 'COP')}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/30 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button onClick={() => handleBuyClick('USD')} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} className="hover:opacity-90">
              <ShoppingCart />
              {t.buy} (USD)
          </Button>
          <Button onClick={() => handleBuyClick('COP')} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} className="hover:opacity-90">
              <ShoppingCart />
              {t.buy} (COP)
          </Button>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href={`bold://checkout/?item_id=${product.id}`} target="_blank">
            <Smartphone />
            {t.buyOnApp}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
