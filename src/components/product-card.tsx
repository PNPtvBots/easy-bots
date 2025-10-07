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
import { Smartphone, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const formatCurrency = (amount: number, currency: 'USD' | 'COP') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

export function ProductCard({ product }: ProductCardProps) {
  const boldCheckoutUrl = 'https://checkout.bold.co/';
  const boldApplinkUrl = 'bold://checkout/';

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
          <CardTitle className="font-headline text-xl">{product.name}</CardTitle>
          <CardDescription className="mt-2 min-h-[40px]">{product.description}</CardDescription>
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
          <Button asChild style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} className="hover:opacity-90">
            <Link href={`${boldCheckoutUrl}?item_id=${product.id}&currency=USD`} target="_blank">
              <ShoppingCart />
              Buy (USD)
            </Link>
          </Button>
          <Button asChild style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} className="hover:opacity-90">
            <Link href={`${boldCheckoutUrl}?item_id=${product.id}&currency=COP`} target="_blank">
              <ShoppingCart />
              Buy (COP)
            </Link>
          </Button>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href={`${boldApplinkUrl}?item_id=${product.id}`} target="_blank">
            <Smartphone />
            Buy on Android App
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
