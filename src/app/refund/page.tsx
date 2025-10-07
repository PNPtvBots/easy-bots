import Link from 'next/link';
import { LegalPageLayout, translations } from '@/components/legal-page-layout';

const content = {
  en: {
    title: 'Refund Policy',
    content: `
      <p>Thank you for shopping at EasyBots Store. We offer refund and/or exchange within the first 30 days of your purchase, if 30 days have passed since your purchase, you will not be offered a refund and/or exchange of any kind.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">1. Eligibility for Refunds and Exchanges</h2>
      <p>Your item must be unused and in the same condition that you received it. The item must be in the original packaging. To complete your return, we require a receipt or proof of purchase.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">2. Digital Products</h2>
      <p>We do not issue refunds for digital products once the order is confirmed and the product is sent. We recommend contacting us for assistance if you experience any issues receiving or downloading our products.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">3. Contact Us</h2>
      <p>If you have any questions about our Returns and Refunds Policy, please contact us by email: support@easybots.store</p>
      <p class="mt-6 text-sm text-muted-foreground">Last updated: ${new Date().toLocaleDateString()}</p>
    `,
  },
  es: {
    title: 'Política de Reembolsos',
    content: `
      <p>Gracias por comprar en la Tienda EasyBots. Ofrecemos reembolso y/o cambio dentro de los primeros 30 días de su compra, si han pasado 30 días desde su compra, no se le ofrecerá un reembolso y/o cambio de ningún tipo.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">1. Elegibilidad para Reembolsos y Cambios</h2>
      <p>Su artículo debe estar sin usar y en las mismas condiciones en que lo recibió. El artículo debe estar en el embalaje original. Para completar su devolución, requerimos un recibo o comprobante de compra.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">2. Productos Digitales</h2>
      <p>No emitimos reembolsos por productos digitales una vez que se confirma el pedido y se envía el producto. Le recomendamos que se ponga en contacto con nosotros para obtener ayuda si experimenta algún problema al recibir o descargar nuestros productos.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">3. Contáctenos</h2>
      <p>Si tiene alguna pregunta sobre nuestra Política de Devoluciones y Reembolsos, contáctenos por correo electrónico: support@easybots.store</p>
      <p class="mt-6 text-sm text-muted-foreground">Última actualización: ${new Date().toLocaleDateString()}</p>
    `,
  },
};


export default function RefundPage({ searchParams }: { searchParams: { lang?: 'es' } }) {
  const lang = searchParams.lang === 'es' ? 'es' : 'en';
  const t = content[lang];
  const commonT = translations[lang];

  return (
    <LegalPageLayout title={t.title} homeHref={`/?lang=${lang}`} t={commonT}>
      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: t.content }} />
    </LegalPageLayout>
  );
}
