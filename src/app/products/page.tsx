
'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { products, Product } from '@/lib/products';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Bot } from 'lucide-react';

const translations = {
    en: {
        title: 'All Products',
        description: 'Here is a list of all available products in our store.',
        goHome: 'Back to Store',
        name: 'Name',
        descriptionHeader: 'Description',
        priceUsd: 'Price (USD)',
        priceCop: 'Price (COP)',
    },
    es: {
        title: 'Todos los Productos',
        description: 'Aquí tienes una lista de todos los productos disponibles en nuestra tienda.',
        goHome: 'Volver a la Tienda',
        name: 'Nombre',
        descriptionHeader: 'Descripción',
        priceUsd: 'Precio (USD)',
        priceCop: 'Precio (COP)',
    },
};

const formatCurrency = (amount: number, currency: 'USD' | 'COP') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') === 'es' ? 'es' : 'en';
  const t = translations[lang];

  return (
    <div className="max-w-4xl mx-auto">
        <header className="mb-8">
            <Link href={`/?lang=${lang}`} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
            <Home className="h-4 w-4" />
            {t.goHome}
            </Link>
            <div className="flex items-center gap-4 mt-4">
                <Bot className="h-10 w-10 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">{t.title}</h1>
            </div>
             <p className="text-lg text-muted-foreground mt-2">{t.description}</p>
        </header>

        <Card>
            <CardContent className="p-0">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>{t.name}</TableHead>
                    <TableHead>{t.descriptionHeader}</TableHead>
                    <TableHead className="text-right">{t.priceUsd}</TableHead>
                    <TableHead className="text-right">{t.priceCop}</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {products.map((product: Product) => (
                    <TableRow key={product.id}>
                    <TableCell className="font-medium">{lang === 'es' ? product.name_es : product.name}</TableCell>
                    <TableCell>{lang === 'es' ? product.description_es : product.description}</TableCell>
                    <TableCell className="text-right">{formatCurrency(product.prices.usd, 'USD')}</TableCell>
                    <TableCell className="text-right">{formatCurrency(product.prices.cop, 'COP')}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
    </div>
  );
}
