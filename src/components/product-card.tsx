
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
import { Smartphone, ShoppingCart, Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Script from 'next/script';

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
    purchaseError: 'Could not create payment link. Please try again.',
    loadingPayment: 'Loading Payment...',
  },
  es: {
    buy: 'Comprar',
    buyOnApp: 'Comprar en la App',
    loginPrompt: 'Por favor, inicia sesión para comprar.',
    purchaseError: 'No se pudo crear el enlace de pago. Por favor, inténtalo de nuevo.',
    loadingPayment: 'Cargando Pago...',
  },
};

export function ProductCard({ product, lang }: ProductCardProps) {
  const t = translations[lang];
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [isEpaycoReady, setIsEpaycoReady] = useState(false);

  const handleBuyClick = (currency: 'USD' | 'COP') => {
    if (!user) {
      toast({
        title: t.loginPrompt,
        variant: 'destructive',
      });
      router.push(`/login?lang=${lang}`);
      return;
    }
    
    if (!isEpaycoReady || !(window as any).ePayco) {
      toast({
        title: 'Payment system not ready',
        description: 'Please wait a moment and try again.',
        variant: 'destructive',
      });
      return;
    }

    const handler = (window as any).ePayco.checkout.create({
      key: process.env.NEXT_PUBLIC_EPAYCO_PUBLIC_KEY,
      test: process.env.NEXT_PUBLIC_EPAYCO_TEST === 'true',
    });

    const amount = currency === 'USD' ? product.prices.usd : product.prices.cop;
    const orderId = `easybots-${product.id}-${Date.now()}`;

    handler.open({
      //Standard Checkout Parameters
      name: lang === 'es' ? product.name_es : product.name,
      description: lang === 'es' ? product.description_es : product.description,
      invoice: orderId,
      currency: currency,
      amount: amount.toString(),
      country: currency === 'COP' ? 'CO' : 'US',
      lang: lang,

      //Onpage="false" - Standard Checkout parameters
      external: 'false',

      //Confirmation page
      confirmation: `${window.location.origin}/api/webhooks/epayco`,
      response: `${window.location.origin}/`,

      //Customer information
      name_billing: user.displayName || 'N/A',
      address_billing: 'N/A',
      type_doc_billing: 'CC',
      mobilephone_billing: user.phoneNumber || '3000000000',
      number_doc_billing: '123456789',
      email_billing: user.email,

      //Extra fields
      extra1: orderId,
      extra2: user.uid,
      extra3: product.id,
    });
  };

  const getAppLink = () => {
    const params = new URLSearchParams({
      'item_id': product.id,
    });
     if (user) {
      params.append('payment_method[metadata][userId]', user.uid);
      if (user.email) params.append('customer[email]', user.email);
      if (user.displayName) params.append('customer[name]', user.displayName);
      if(user.phoneNumber) params.append('customer[phone_number]', user.phoneNumber);
    }
    return `bold://checkout/?${params.toString()}`;
  }

  return (
    <>
      <Script 
        src="https://checkout.epayco.co/checkout.js" 
        strategy="beforeInteractive"
        onLoad={() => {
          setIsEpaycoReady(true);
        }}
      />
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
            <Button onClick={() => handleBuyClick('USD')} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} className="hover:opacity-90" disabled={!isEpaycoReady}>
                {isEpaycoReady ? <ShoppingCart /> : <Loader2 className="animate-spin" />}
                {isEpaycoReady ? `${t.buy} (USD)` : t.loadingPayment}
            </Button>
            <Button onClick={() => handleBuyClick('COP')} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} className="hover:opacity-90" disabled={!isEpaycoReady}>
                {isEpaycoReady ? <ShoppingCart /> : <Loader2 className="animate-spin" />}
                {isEpaycoReady ? `${t.buy} (COP)` : t.loadingPayment}
            </Button>
          </div>
          <Button asChild variant="outline" className="w-full">
            <Link href={getAppLink()} target="_blank">
              <Smartphone />
              {t.buyOnApp}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
