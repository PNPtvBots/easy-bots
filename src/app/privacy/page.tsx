import Link from 'next/link';
import { LegalPageLayout, translations } from '@/components/legal-page-layout';

const content = {
  en: {
    title: 'Privacy Policy',
    content: `
      <p>Your privacy is important to us. It is EasyBots Store's policy to respect your privacy regarding any information we may collect from you across our website.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">1. Information We Collect</h2>
      <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">2. Use of Information</h2>
      <p>We may use the information we collect for various purposes, including to provide and maintain our Service, to notify you about changes to our Service, and to provide customer support.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">3. Data Retention</h2>
      <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">4. Cookies</h2>
      <p>We use cookies to help improve your experience of our website. This cookie policy is part of EasyBots Store's privacy policy, and covers the use of cookies between your device and our site.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">5. Links to Other Sites</h2>
      <p>Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.</p>
      <p class="mt-6 text-sm text-muted-foreground">Last updated: ${new Date().toLocaleDateString()}</p>
    `,
  },
  es: {
    title: 'Política de Privacidad',
    content: `
      <p>Su privacidad es importante para nosotros. Es política de la Tienda EasyBots respetar su privacidad con respecto a cualquier información que podamos recopilar de usted a través de nuestro sitio web.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">1. Información que Recopilamos</h2>
      <p>Solo pedimos información personal cuando realmente la necesitamos para brindarle un servicio. La recopilamos por medios justos y legales, con su conocimiento y consentimiento. También le informamos por qué la recopilamos y cómo se utilizará.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">2. Uso de la Información</h2>
      <p>Podemos utilizar la información que recopilamos para diversos fines, entre ellos, para proporcionar y mantener nuestro Servicio, para notificarle sobre cambios en nuestro Servicio y para brindar soporte al cliente.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">3. Retención de Datos</h2>
      <p>Solo retenemos la información recopilada durante el tiempo que sea necesario para brindarle el servicio solicitado. Los datos que almacenamos, los protegeremos dentro de los medios comercialmente aceptables para evitar pérdidas y robos, así como el acceso, la divulgación, la copia, el uso o la modificación no autorizados.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">4. Cookies</h2>
      <p>Utilizamos cookies para ayudar a mejorar su experiencia en nuestro sitio web. Esta política de cookies es parte de la política de privacidad de la Tienda EasyBots y cubre el uso de cookies entre su dispositivo y nuestro sitio.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">5. Enlaces a Otros Sitios</h2>
      <p>Nuestro sitio web puede tener enlaces a sitios externos que no son operados por nosotros. Tenga en cuenta que no tenemos control sobre el contenido y las prácticas de estos sitios, y no podemos aceptar responsabilidad por sus respectivas políticas de privacidad.</p>
      <p class="mt-6 text-sm text-muted-foreground">Última actualización: ${new Date().toLocaleDateString()}</p>
    `,
  },
};

export default function PrivacyPage({ searchParams }: { searchParams: { lang?: string } }) {
  const lang = searchParams.lang === 'es' ? 'es' : 'en';
  const t = content[lang];
  const commonT = translations[lang];

  return (
    <LegalPageLayout title={t.title} homeHref={`/?lang=${lang}`} t={commonT}>
      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: t.content }} />
    </LegalPageLayout>
  );
}
