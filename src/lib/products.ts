import { PlaceHolderImages } from './placeholder-images';

export type Product = {
  id: string;
  name: string;
  name_es: string;
  description: string;
  description_es: string;
  image: {
    src: string;
    hint: string;
  };
  prices: {
    usd: number;
    cop: number;
  };
};

const findImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  return {
    src: image?.imageUrl ?? `https://picsum.photos/seed/${id}/600/400`,
    hint: image?.imageHint ?? 'product image',
  };
};

export const products: Product[] = [
  {
    id: 'botpress-expert',
    name: 'BotPress Expert',
    name_es: 'Experto en BotPress',
    description: 'Master chatbot building and management with our premier BotPress development service.',
    description_es: 'Domina la creación y gestión de chatbots con nuestro principal servicio de desarrollo de BotPress.',
    image: findImage('botpress-expert'),
    prices: {
      usd: 149,
      cop: 596000,
    },
  },
  {
    id: 'voiceflow-assistant',
    name: 'Voiceflow Assistant',
    name_es: 'Asistente de Voiceflow',
    description: 'Create sophisticated, voice-enabled applications and assistants for any platform.',
    description_es: 'Crea aplicaciones y asistentes de voz sofisticados para cualquier plataforma.',
    image: findImage('voiceflow-assistant'),
    prices: {
      usd: 129,
      cop: 516000,
    },
  },
  {
    id: 'manychat-automator',
    name: 'ManyChat Automator',
    name_es: 'Automatizador de ManyChat',
    description: 'Automate your Messenger marketing to engage customers and drive sales effortlessly.',
    description_es: 'Automatiza tu marketing de Messenger para atraer clientes e impulsar las ventas sin esfuerzo.',
    image: findImage('manychat-automator'),
    prices: {
      usd: 99,
      cop: 396000,
    },
  },
  {
    id: 'dialogflow-integrator',
    name: 'Dialogflow Integrator',
    name_es: 'Integrador de Dialogflow',
    description: 'Integrate powerful conversational AI into your apps with Google\'s Dialogflow.',
    description_es: 'Integra una potente IA conversacional en tus aplicaciones con Dialogflow de Google.',
    image: findImage('dialogflow-integrator'),
    prices: {
      usd: 199,
      cop: 796000,
    },
  },
  {
    id: 'landing-page-leads',
    name: 'Landing Page + Lead Capture',
    name_es: 'Landing Page + Captura de Leads',
    description: 'A simple and effective landing page to capture leads for your business.',
    description_es: 'Una landing page sencilla y efectiva para capturar leads para tu negocio.',
    image: findImage('landing-page-leads'),
    prices: {
      usd: 50,
      cop: 196000,
    },
  },
  {
    id: 'telegram-bot',
    name: 'Telegram Bot',
    name_es: 'Bot de Telegram',
    description: 'Subscriber management, occupancy, e-commerce sales, and more.',
    description_es: 'Manejo de suscriptores, ocupación, ventas de e-commerce y más opciones.',
    image: findImage('telegram-bot'),
    prices: {
      usd: 60,
      cop: 240000,
    },
  },
];
