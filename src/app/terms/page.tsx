
'use client';
import { useSearchParams } from 'next/navigation';
import { LegalPageLayout, translations } from '@/components/legal-page-layout';

const content = {
  en: {
    title: 'Terms and Conditions',
    content: `
      <p>Welcome to EasyBots Store! These terms and conditions outline the rules and regulations for the use of our website and services.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">1. Interpretation and Definitions</h2>
      <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">2. Acknowledgment</h2>
      <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use EasyBots Store if you do not agree to take all of the terms and conditions stated on this page.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">3. Intellectual Property</h2>
      <p>The Service and its original content, features and functionality are and will remain the exclusive property of the Company and its licensors. The Service is protected by copyright, trademark, and other laws of both the Country and foreign countries.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">4. Disclaimer</h2>
      <p>The materials on EasyBots Store's website are provided on an 'as is' basis. EasyBots Store makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">5. Governing Law</h2>
      <p>The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.</p>
      <p class="mt-6 text-sm text-muted-foreground">Last updated: ${new Date().toLocaleDateString()}</p>
    `,
  },
  es: {
    title: 'Términos y Condiciones',
    content: `
      <p>¡Bienvenido a la Tienda EasyBots! Estos términos y condiciones describen las reglas y regulaciones para el uso de nuestro sitio web y servicios.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">1. Interpretación y Definiciones</h2>
      <p>Las palabras cuya letra inicial está en mayúscula tienen significados definidos en las siguientes condiciones. Las siguientes definitions tendrán el mismo significado independientemente de que aparezcan en singular o en plural.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">2. Reconocimiento</h2>
      <p>Al acceder a este sitio web, asumimos que acepta estos términos y condiciones. No continúe usando la Tienda EasyBots si no está de acuerdo con todos los términos y condiciones establecidos en esta página.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">3. Propiedad Intelectual</h2>
      <p>El Servicio y su contenido, características y funcionalidades originales son y seguirán siendo propiedad exclusiva de la Compañía y sus licenciantes. El Servicio está protegido por derechos de autor, marcas registradas y otras leyes tanto del País como de países extranjeros.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">4. Descargo de Responsabilidad</h2>
      <p>Los materiales en el sitio web de la Tienda EasyBots se proporcionan 'tal cual'. La Tienda EasyBots no ofrece garantías, expresas o implícitas, y por la presente renuncia y niega todas las demás garantías, incluidas, entre otras, las garantías implícitas o condiciones de comerciabilidad, idoneidad para un propósito particular o no infracción de la propiedad intelectual u otra violación de derechos.</p>
      <h2 class="text-xl font-bold mt-6 mb-2">5. Ley Aplicable</h2>
      <p>Las leyes del País, excluyendo sus conflictos de leyes, regirán estos Términos y su uso del Servicio. Su uso de la Aplicación también puede estar sujeto a otras leyes locales, estatales, nacionales o internacionales.</p>
      <p class="mt-6 text-sm text-muted-foreground">Última actualización: ${new Date().toLocaleDateString()}</p>
    `,
  },
};


export default function TermsPage() {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') === 'es' ? 'es' : 'en';
  const t = content[lang];
  const commonT = translations[lang];

  return (
    <LegalPageLayout title={t.title} homeHref={`/?lang=${lang}`} t={commonT}>
      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: t.content }} />
    </LegalPageLayout>
  );
}
