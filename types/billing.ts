import { Label } from '@/components/ui/label';
export enum PackId {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export type Creditspack = {
  id: PackId;
  name: string;
  Label: string;
  credits: number;
  price: number;
  priceId: string;
};

export const CreditsPack: Creditspack[] = [
  {
    id: PackId.SMALL,
    name: 'Small Pack',
    Label: '1,000 credits',
    credits: 1000,
    price: 2000,
    priceId: process.env.STRIPE_SMALL_PACK_PRICE_ID!,
  },
  {
    id: PackId.MEDIUM,
    name: 'Medium Pack',
    Label: '5,000 credits',
    credits: 5000,
    price: 4000,
    priceId: process.env.STRIPE_MEDIUM_PACK_PRICE_ID!,
  },
  {
    id: PackId.LARGE,
    name: 'large Pack',
    Label: '10,000 credits',
    credits: 10000,
    price: 6000,
    priceId: process.env.STRIPE_LARGE_PACK_PRICE_ID!,
  },
];

export const getCreditPack = (id: PackId, price?: number) => {
  return CreditsPack.find((p) => {
    if (price) {
      return  p.price === price;
    } else {
      return p.id === id;
    }
  });
};
