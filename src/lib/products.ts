import { PlaceHolderImages } from './placeholder-images';

export type Product = {
  id: string;
  name: string;
  description: string;
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
    description: 'Master chatbot building and management with our premier BotPress development service.',
    image: findImage('botpress-expert'),
    prices: {
      usd: 149,
      cop: 596000,
    },
  },
  {
    id: 'voiceflow-assistant',
    name: 'Voiceflow Assistant',
    description: 'Create sophisticated, voice-enabled applications and assistants for any platform.',
    image: findImage('voiceflow-assistant'),
    prices: {
      usd: 129,
      cop: 516000,
    },
  },
  {
    id: 'manychat-automator',
    name: 'ManyChat Automator',
    description: 'Automate your Messenger marketing to engage customers and drive sales effortlessly.',
    image: findImage('manychat-automator'),
    prices: {
      usd: 99,
      cop: 396000,
    },
  },
  {
    id: 'dialogflow-integrator',
    name: 'Dialogflow Integrator',
    description: 'Integrate powerful conversational AI into your apps with Google\'s Dialogflow.',
    image: findImage('dialogflow-integrator'),
    prices: {
      usd: 199,
      cop: 796000,
    },
  },
];
